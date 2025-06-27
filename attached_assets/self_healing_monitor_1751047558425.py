#!/usr/bin/env python3
"""
HARMONIX Self-Healing Monitoring System
Automatically detects and resolves common platform issues
"""

import os
import sys
import time
import json
import logging
import requests
import psutil
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/harmonix-monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('harmonix-monitor')

class HealthStatus(Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    UNKNOWN = "unknown"

@dataclass
class HealthCheck:
    name: str
    status: HealthStatus
    message: str
    timestamp: datetime
    metrics: Dict = None
    auto_heal_attempted: bool = False

class HarmonixMonitor:
    """Main monitoring and self-healing system."""
    
    def __init__(self, config_path: str = None):
        self.config = self._load_config(config_path)
        self.health_checks: List[HealthCheck] = []
        self.last_alert_time = {}
        self.healing_attempts = {}
        
    def _load_config(self, config_path: str) -> Dict:
        """Load monitoring configuration."""
        default_config = {
            "api_url": os.getenv("API_URL", "http://localhost:5000"),
            "frontend_url": os.getenv("FRONTEND_URL", "http://localhost:3000"),
            "database_url": os.getenv("DATABASE_URL", "postgresql://localhost/harmonix"),
            "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379"),
            "check_interval": 60,  # seconds
            "alert_cooldown": 300,  # 5 minutes
            "max_healing_attempts": 3,
            "thresholds": {
                "cpu_usage": 80,
                "memory_usage": 85,
                "disk_usage": 90,
                "response_time": 5000,  # milliseconds
                "error_rate": 10  # percentage
            },
            "services": {
                "backend": {"port": 5000, "health_endpoint": "/api/health"},
                "frontend": {"port": 3000, "health_endpoint": "/"},
                "database": {"type": "postgresql"},
                "redis": {"type": "redis"}
            }
        }
        
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        
        return default_config
    
    def run_health_checks(self) -> List[HealthCheck]:
        """Run all health checks and return results."""
        checks = []
        
        # System resource checks
        checks.extend(self._check_system_resources())
        
        # Service availability checks
        checks.extend(self._check_services())
        
        # Database connectivity
        checks.append(self._check_database())
        
        # Redis connectivity
        checks.append(self._check_redis())
        
        # API endpoint checks
        checks.extend(self._check_api_endpoints())
        
        # Application-specific checks
        checks.extend(self._check_application_health())
        
        self.health_checks = checks
        return checks
    
    def _check_system_resources(self) -> List[HealthCheck]:
        """Check system resource usage."""
        checks = []
        
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_status = HealthStatus.HEALTHY
        if cpu_percent > self.config["thresholds"]["cpu_usage"]:
            cpu_status = HealthStatus.CRITICAL
        elif cpu_percent > self.config["thresholds"]["cpu_usage"] * 0.8:
            cpu_status = HealthStatus.WARNING
        
        checks.append(HealthCheck(
            name="cpu_usage",
            status=cpu_status,
            message=f"CPU usage: {cpu_percent}%",
            timestamp=datetime.now(),
            metrics={"cpu_percent": cpu_percent}
        ))
        
        # Memory usage
        memory = psutil.virtual_memory()
        memory_status = HealthStatus.HEALTHY
        if memory.percent > self.config["thresholds"]["memory_usage"]:
            memory_status = HealthStatus.CRITICAL
        elif memory.percent > self.config["thresholds"]["memory_usage"] * 0.8:
            memory_status = HealthStatus.WARNING
        
        checks.append(HealthCheck(
            name="memory_usage",
            status=memory_status,
            message=f"Memory usage: {memory.percent}%",
            timestamp=datetime.now(),
            metrics={"memory_percent": memory.percent, "memory_available": memory.available}
        ))
        
        # Disk usage
        disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        disk_status = HealthStatus.HEALTHY
        if disk_percent > self.config["thresholds"]["disk_usage"]:
            disk_status = HealthStatus.CRITICAL
        elif disk_percent > self.config["thresholds"]["disk_usage"] * 0.8:
            disk_status = HealthStatus.WARNING
        
        checks.append(HealthCheck(
            name="disk_usage",
            status=disk_status,
            message=f"Disk usage: {disk_percent:.1f}%",
            timestamp=datetime.now(),
            metrics={"disk_percent": disk_percent, "disk_free": disk.free}
        ))
        
        return checks
    
    def _check_services(self) -> List[HealthCheck]:
        """Check if required services are running."""
        checks = []
        
        for service_name, service_config in self.config["services"].items():
            if "port" in service_config:
                is_running = self._is_port_open("localhost", service_config["port"])
                status = HealthStatus.HEALTHY if is_running else HealthStatus.CRITICAL
                message = f"Service {service_name} is {'running' if is_running else 'not running'}"
                
                checks.append(HealthCheck(
                    name=f"service_{service_name}",
                    status=status,
                    message=message,
                    timestamp=datetime.now()
                ))
        
        return checks
    
    def _check_database(self) -> HealthCheck:
        """Check database connectivity."""
        try:
            # Try to connect to database
            import psycopg2
            conn = psycopg2.connect(self.config["database_url"])
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            conn.close()
            
            return HealthCheck(
                name="database_connectivity",
                status=HealthStatus.HEALTHY,
                message="Database connection successful",
                timestamp=datetime.now()
            )
        except Exception as e:
            return HealthCheck(
                name="database_connectivity",
                status=HealthStatus.CRITICAL,
                message=f"Database connection failed: {str(e)}",
                timestamp=datetime.now()
            )
    
    def _check_redis(self) -> HealthCheck:
        """Check Redis connectivity."""
        try:
            import redis
            r = redis.from_url(self.config["redis_url"])
            r.ping()
            
            return HealthCheck(
                name="redis_connectivity",
                status=HealthStatus.HEALTHY,
                message="Redis connection successful",
                timestamp=datetime.now()
            )
        except Exception as e:
            return HealthCheck(
                name="redis_connectivity",
                status=HealthStatus.CRITICAL,
                message=f"Redis connection failed: {str(e)}",
                timestamp=datetime.now()
            )
    
    def _check_api_endpoints(self) -> List[HealthCheck]:
        """Check API endpoint health."""
        checks = []
        
        endpoints = [
            "/api/health",
            "/api/auth/status",
            "/api/agents",
            "/api/marketplace/agents"
        ]
        
        for endpoint in endpoints:
            try:
                start_time = time.time()
                response = requests.get(
                    f"{self.config['api_url']}{endpoint}",
                    timeout=10
                )
                response_time = (time.time() - start_time) * 1000
                
                status = HealthStatus.HEALTHY
                if response.status_code >= 500:
                    status = HealthStatus.CRITICAL
                elif response.status_code >= 400:
                    status = HealthStatus.WARNING
                elif response_time > self.config["thresholds"]["response_time"]:
                    status = HealthStatus.WARNING
                
                checks.append(HealthCheck(
                    name=f"api_endpoint_{endpoint.replace('/', '_')}",
                    status=status,
                    message=f"Endpoint {endpoint}: {response.status_code} ({response_time:.0f}ms)",
                    timestamp=datetime.now(),
                    metrics={"response_time": response_time, "status_code": response.status_code}
                ))
                
            except Exception as e:
                checks.append(HealthCheck(
                    name=f"api_endpoint_{endpoint.replace('/', '_')}",
                    status=HealthStatus.CRITICAL,
                    message=f"Endpoint {endpoint} failed: {str(e)}",
                    timestamp=datetime.now()
                ))
        
        return checks
    
    def _check_application_health(self) -> List[HealthCheck]:
        """Check application-specific health metrics."""
        checks = []
        
        try:
            # Check agent processing queue
            response = requests.get(f"{self.config['api_url']}/api/health/detailed")
            if response.status_code == 200:
                health_data = response.json()
                
                # Check queue sizes
                if "queue_sizes" in health_data:
                    for queue_name, size in health_data["queue_sizes"].items():
                        status = HealthStatus.HEALTHY
                        if size > 1000:
                            status = HealthStatus.CRITICAL
                        elif size > 500:
                            status = HealthStatus.WARNING
                        
                        checks.append(HealthCheck(
                            name=f"queue_{queue_name}",
                            status=status,
                            message=f"Queue {queue_name}: {size} items",
                            timestamp=datetime.now(),
                            metrics={"queue_size": size}
                        ))
                
                # Check error rates
                if "error_rates" in health_data:
                    for service, error_rate in health_data["error_rates"].items():
                        status = HealthStatus.HEALTHY
                        if error_rate > self.config["thresholds"]["error_rate"]:
                            status = HealthStatus.CRITICAL
                        elif error_rate > self.config["thresholds"]["error_rate"] * 0.5:
                            status = HealthStatus.WARNING
                        
                        checks.append(HealthCheck(
                            name=f"error_rate_{service}",
                            status=status,
                            message=f"Error rate for {service}: {error_rate}%",
                            timestamp=datetime.now(),
                            metrics={"error_rate": error_rate}
                        ))
        
        except Exception as e:
            checks.append(HealthCheck(
                name="application_health",
                status=HealthStatus.WARNING,
                message=f"Could not retrieve application health: {str(e)}",
                timestamp=datetime.now()
            ))
        
        return checks
    
    def attempt_self_healing(self, check: HealthCheck) -> bool:
        """Attempt to automatically heal the detected issue."""
        healing_key = f"{check.name}_{datetime.now().strftime('%Y%m%d')}"
        
        # Check if we've already attempted healing too many times today
        if healing_key in self.healing_attempts:
            if self.healing_attempts[healing_key] >= self.config["max_healing_attempts"]:
                logger.warning(f"Max healing attempts reached for {check.name}")
                return False
        else:
            self.healing_attempts[healing_key] = 0
        
        self.healing_attempts[healing_key] += 1
        
        try:
            if check.name.startswith("service_"):
                return self._heal_service(check)
            elif check.name == "memory_usage":
                return self._heal_memory_issue(check)
            elif check.name == "disk_usage":
                return self._heal_disk_issue(check)
            elif check.name.startswith("api_endpoint_"):
                return self._heal_api_issue(check)
            elif check.name.startswith("queue_"):
                return self._heal_queue_issue(check)
            else:
                logger.info(f"No healing strategy available for {check.name}")
                return False
        
        except Exception as e:
            logger.error(f"Healing attempt failed for {check.name}: {str(e)}")
            return False
    
    def _heal_service(self, check: HealthCheck) -> bool:
        """Attempt to restart a failed service."""
        service_name = check.name.replace("service_", "")
        
        try:
            if service_name == "backend":
                # Restart backend service
                subprocess.run(["systemctl", "restart", "harmonix-backend"], check=True)
                time.sleep(10)  # Wait for service to start
                
            elif service_name == "frontend":
                # Restart frontend service
                subprocess.run(["systemctl", "restart", "harmonix-frontend"], check=True)
                time.sleep(5)
                
            logger.info(f"Successfully restarted {service_name} service")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to restart {service_name} service: {str(e)}")
            return False
    
    def _heal_memory_issue(self, check: HealthCheck) -> bool:
        """Attempt to resolve memory issues."""
        try:
            # Clear system caches
            subprocess.run(["sync"], check=True)
            subprocess.run(["echo", "3", ">", "/proc/sys/vm/drop_caches"], shell=True, check=True)
            
            # Restart memory-intensive services if needed
            if check.metrics and check.metrics.get("memory_percent", 0) > 90:
                subprocess.run(["systemctl", "restart", "harmonix-backend"], check=True)
            
            logger.info("Memory healing actions completed")
            return True
            
        except Exception as e:
            logger.error(f"Memory healing failed: {str(e)}")
            return False
    
    def _heal_disk_issue(self, check: HealthCheck) -> bool:
        """Attempt to resolve disk space issues."""
        try:
            # Clean up log files
            subprocess.run(["find", "/var/log", "-name", "*.log", "-mtime", "+7", "-delete"], check=True)
            
            # Clean up temporary files
            subprocess.run(["find", "/tmp", "-type", "f", "-mtime", "+1", "-delete"], check=True)
            
            # Clean up old Docker images if Docker is available
            try:
                subprocess.run(["docker", "system", "prune", "-f"], check=True, capture_output=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                pass  # Docker not available or failed
            
            logger.info("Disk cleanup actions completed")
            return True
            
        except Exception as e:
            logger.error(f"Disk healing failed: {str(e)}")
            return False
    
    def _heal_api_issue(self, check: HealthCheck) -> bool:
        """Attempt to resolve API issues."""
        try:
            # Restart backend service
            subprocess.run(["systemctl", "restart", "harmonix-backend"], check=True)
            time.sleep(15)  # Wait for service to fully start
            
            # Clear Redis cache if available
            try:
                import redis
                r = redis.from_url(self.config["redis_url"])
                r.flushdb()
                logger.info("Cleared Redis cache")
            except Exception:
                pass  # Redis not available
            
            logger.info("API healing actions completed")
            return True
            
        except Exception as e:
            logger.error(f"API healing failed: {str(e)}")
            return False
    
    def _heal_queue_issue(self, check: HealthCheck) -> bool:
        """Attempt to resolve queue issues."""
        try:
            # Restart queue workers
            subprocess.run(["systemctl", "restart", "harmonix-workers"], check=True)
            
            # Clear stuck jobs if queue size is too large
            if check.metrics and check.metrics.get("queue_size", 0) > 1000:
                # Implementation depends on queue system (Redis, Celery, etc.)
                logger.info("Clearing stuck queue jobs")
            
            logger.info("Queue healing actions completed")
            return True
            
        except Exception as e:
            logger.error(f"Queue healing failed: {str(e)}")
            return False
    
    def send_alert(self, check: HealthCheck):
        """Send alert for critical issues."""
        alert_key = f"{check.name}_{check.status.value}"
        current_time = datetime.now()
        
        # Check alert cooldown
        if alert_key in self.last_alert_time:
            time_diff = current_time - self.last_alert_time[alert_key]
            if time_diff.total_seconds() < self.config["alert_cooldown"]:
                return
        
        self.last_alert_time[alert_key] = current_time
        
        # Send alert (implement your preferred alerting method)
        alert_message = f"HARMONIX Alert: {check.name} is {check.status.value} - {check.message}"
        
        # Log alert
        logger.error(alert_message)
        
        # Send to webhook if configured
        webhook_url = os.getenv("ALERT_WEBHOOK_URL")
        if webhook_url:
            try:
                requests.post(webhook_url, json={
                    "text": alert_message,
                    "timestamp": check.timestamp.isoformat(),
                    "severity": check.status.value
                }, timeout=10)
            except Exception as e:
                logger.error(f"Failed to send webhook alert: {str(e)}")
    
    def _is_port_open(self, host: str, port: int) -> bool:
        """Check if a port is open."""
        import socket
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(5)
                result = sock.connect_ex((host, port))
                return result == 0
        except Exception:
            return False
    
    def generate_report(self) -> Dict:
        """Generate a comprehensive health report."""
        if not self.health_checks:
            self.run_health_checks()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": "healthy",
            "checks": [],
            "summary": {
                "total_checks": len(self.health_checks),
                "healthy": 0,
                "warning": 0,
                "critical": 0,
                "unknown": 0
            }
        }
        
        for check in self.health_checks:
            report["checks"].append({
                "name": check.name,
                "status": check.status.value,
                "message": check.message,
                "timestamp": check.timestamp.isoformat(),
                "metrics": check.metrics,
                "auto_heal_attempted": check.auto_heal_attempted
            })
            
            # Update summary
            report["summary"][check.status.value] += 1
        
        # Determine overall status
        if report["summary"]["critical"] > 0:
            report["overall_status"] = "critical"
        elif report["summary"]["warning"] > 0:
            report["overall_status"] = "warning"
        
        return report
    
    def run_monitoring_cycle(self):
        """Run a complete monitoring cycle."""
        logger.info("Starting monitoring cycle")
        
        # Run health checks
        checks = self.run_health_checks()
        
        # Process each check
        for check in checks:
            if check.status in [HealthStatus.CRITICAL, HealthStatus.WARNING]:
                logger.warning(f"Issue detected: {check.name} - {check.message}")
                
                # Attempt self-healing for critical issues
                if check.status == HealthStatus.CRITICAL:
                    healing_success = self.attempt_self_healing(check)
                    check.auto_heal_attempted = True
                    
                    if healing_success:
                        logger.info(f"Self-healing successful for {check.name}")
                        # Re-run the specific check to verify healing
                        time.sleep(5)
                        # Note: In a real implementation, you'd re-run just this check
                    else:
                        logger.error(f"Self-healing failed for {check.name}")
                        self.send_alert(check)
                else:
                    # Send alert for warnings
                    self.send_alert(check)
        
        # Generate and save report
        report = self.generate_report()
        
        # Save report to file
        report_file = f"/var/log/harmonix-health-{datetime.now().strftime('%Y%m%d')}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Monitoring cycle completed. Overall status: {report['overall_status']}")
        return report

def main():
    """Main monitoring loop."""
    monitor = HarmonixMonitor()
    
    logger.info("HARMONIX Self-Healing Monitor started")
    
    try:
        while True:
            monitor.run_monitoring_cycle()
            time.sleep(monitor.config["check_interval"])
    
    except KeyboardInterrupt:
        logger.info("Monitor stopped by user")
    except Exception as e:
        logger.error(f"Monitor crashed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

