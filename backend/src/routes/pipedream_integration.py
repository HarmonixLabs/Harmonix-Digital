    """Get all available agents and their configurations"""""
    try:
              return jsonify({
                            'success': True,
                            'agents': AGENT_CONFIGS,
                            'endpoints': PIPEDREAM_ENDPOINTS,
                            'total_agents': len(AGENT_CONFIGS)
              }), 200
    except Exception as e:
              current_app.logger.error(f"Error getting agents: {str(e)}")
              return jsonify({'error': 'Failed to retrieve agents'}), 500

      @pipedream_bp.route('/agent/<agent_id>/demo', methods=['POST'])
def demo_agent(agent_id):
      """Demo a specific agent with test data"""""
      try:
                if agent_id not in AGENT_CONFIGS:
                              return jsonify({'error': 'Agent not found'}), 404

          data = request.get_json()
        message = data.get('message', '')

        if not message:
                      return jsonify({'error': 'Message is required'}), 400

        # Prepare payload for Pipedream
        payload = {
                      'agent_id': agent_id,
                      'message': message,
           
        }
              })