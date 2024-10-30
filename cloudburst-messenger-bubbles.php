<?php
/**
 * Plugin Name: Cloudburst Messenger Bubbles
 * Author: Cloudburst Ink
 * Description: Adds a clean, easy-to-use "Messenger Bubble" block to represent chat conversations.
 * Version: 1.0.0
 */

	// Register block type
	function cloudburst_messenger_bubble() {
		wp_enqueue_script('register-cloudburst-messenger-bubble', 
			plugin_dir_url(__FILE__) . '/messenger-bubble-block.js', 
			array('wp-blocks', 'wp-i18n', 'wp-editor'), true);
		wp_register_style('cloudburst-messenger-bubbles-css', 
			plugin_dir_url(__FILE__) . '/cloudburst-messenger-bubbles.css');
		wp_enqueue_style('cloudburst-messenger-bubbles-css');
	}
	add_action('enqueue_block_editor_assets', 'cloudburst_messenger_bubble');

	// Register styles
	function cloudburst_messenger_bubble_css() {
		wp_register_style('cloudburst-messenger-bubbles-css', 
			plugin_dir_url(__FILE__) . '/cloudburst-messenger-bubbles.css');
		wp_enqueue_style('cloudburst-messenger-bubbles-css');
	}
	add_action('wp_print_styles', 'cloudburst_messenger_bubble_css');

?>