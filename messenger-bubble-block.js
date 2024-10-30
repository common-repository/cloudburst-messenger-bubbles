
/*************************************
     STYLE FUNCTIONS
*************************************/

// Define custom CSS classes
const baseClassName = 'wp-block-cloudburst-messenger';
const bubbleClassNameSuffix = '-bubble';
const timestampClassNameSuffix = '-timestamp';

// Define defaults
const defaultFontColor = 'rgba(255,255,255,1)';
const defaultBubbleColor = '#3b5998';

// Align left/right
function getMarginAttributes(props) {
	return props.attributes.bubbleAlignment == 'left' 
		? {'margin-right': 'auto'} 
		: {'margin-left': 'auto'};
}

// Colors
function getColorAttributes(props) {
	var fontColor = (props.attributes.fontColor == null 
		|| props.attributes.fontColor == undefined) 
			? defaultFontColor : props.attributes.fontColor;
	var bubbleColor = (props.attributes.bubbleColor == null 
		&& props.attributes.bubbleColor == undefined) 
			? defaultBubbleColor : props.attributes.bubbleColor;
	return {
		color: "".concat(fontColor),
		backgroundColor: "".concat(bubbleColor)
	};
}

// Bubble shape
function getShapeAttributes(props) {
	const bubbleType = props.attributes.bubbleType;
	// If alignment has not been set, default to right
	const rightAligned = (props.attributes.bubbleAlignment == null 
		|| props.attributes.bubbleAlignment == undefined) 
		? true : props.attributes.bubbleAlignment == 'right';
	// 20px border radius on non-joined corners
	var borderValues = '20px';
	if (bubbleType == 'top') {
		if (rightAligned) {
			borderValues = '20px 20px 5px 20px';
		} else {
			borderValues = '20px 20px 20px 5px';
		}
	} else if (bubbleType == 'middle') {
		if (rightAligned) {
			borderValues = '20px 5px 5px 20px';
		} else {
			borderValues = '5px 20px 20px 5px';
		}
	} else if (bubbleType == 'bottom') {
		if (rightAligned) {
			borderValues = '20px 5px 20px 20px';
		} else {
			borderValues = '5px 20px 20px 20px';
		}
	}
	return {
		'border-radius': borderValues,
		'-webkit-border-radius': borderValues,
		'-moz-border-radius': borderValues,
	};
}

// Create full style object
function getBubbleStyleAttributes(props) {
	var styles = {...getMarginAttributes(props), ...getColorAttributes(props), ...getShapeAttributes(props)};
	return styles;
}

// Create full style object
function getTimestampStyleAttributes(props) {
	// If alignment has not been set, default to right
	const alignment = (props.attributes.bubbleAlignment == null 
		|| props.attributes.bubbleAlignment == undefined) 
			? 'right' : props.attributes.bubbleAlignment;
	var style = {
		'text-align': alignment,
		color: props.attributes.timestampColor
	}
	if (!props.attributes.withTimestamp) {
		style = {...style, ...{display: 'none'}};
	}
	return style;
}


/*************************************
     MESSENGER BUBBLE
*************************************/

wp.blocks.registerBlockType('cloudburst/messenger', {

	// Built-in Attributes
    title: 'Messenger Bubble',
    description: 'A messenger bubble for displaying text conversations.',
    icon: 'format-chat',
	category: 'formatting',
    keywords: [
        'message',
        'text',
        'cloudburst'
    ],

    // Custom Attributes
    attributes: {
        message: {
            type: 'array',
            source: 'children',
            selector: '.message-body',
        },
        fontColor: {type: 'string'},
		bubbleColor: {type: 'string'},
		bubbleAlignment: {type: 'string'},
		bubbleType: {type: 'string'},
		withTimestamp: {type: 'boolean'},
		timestamp: {
            type: 'array',
            source: 'children',
            selector: '.message-body',
        }
    },

    /*
	  Editor
	*/
    edit: props => {

    	/*
	    Preset Colors
	    */

        const bubbleColors = [
	        { name: 'Blue', color: '#3b5998' },
	        { name: 'Grey', color: '#f1f0f0' },
	        { name: 'Teal', color: '#44bec7' },
	        { name: 'Turquoise', color: '#20cef5' },
	        { name: 'Purple', color: '#7646ff' },
	        { name: 'Green', color: '#13cf13' },
	        { name: 'Peach', color: '#e68585' },
	        { name: 'Red', color: '#dc4a56' },
	        { name: 'Fuschia', color: '#ff5ca1' },
	        { name: 'Pink', color: '#d696bb' },
	        { name: 'Orange', color: '#ff7e29' },
	        { name: 'Yellow', color: '#ffc300' }
	    ];

	    const fontColors = [
	        { name: 'Light', color: 'rgba(255,255,255,1)' },
	        { name: 'Dark', color: 'rgba(0,0,0,1)' }
	    ];


	    /*
	    Editor Functions
	    */

	    // Toggle timestamp visibility
	    function updateTimestampVisibility(value) {
	    	props.setAttributes({
				withTimestamp: value
			});
	    }

	    // Update timestamp contents
	    function updateTimestamp(value) {
	    	props.setAttributes({
				timestamp: value
			});
	    }

        // Toggle message side
    	function updateAlignment(value) {
    		props.setAttributes({
				bubbleAlignment: value
			});
    	}

    	// Update bubble type (top, middle, bottom)
		function updateBubbleType(value) {
			props.setAttributes({
				bubbleType: value
			});
		}

    	// Update the background color of the messenger bubble
		function updateBubbleColor(value) {
			props.setAttributes({
				bubbleColor: value
			});
		}

		// Update the text color within the messenger bubble
		function updateFontColor(value) {
			props.setAttributes({
				fontColor: value
			});
		}

		// Update the content of the text message
		function updateMessage(value) {
			props.setAttributes({
				message: value
			});
		}


		/*
	    Editor Display
	    */

        return wp.element.createElement("div", null, 
        	// Sidebar Tools
        	wp.element.createElement(wp.blockEditor.InspectorControls, null, 
        		// Shape Settings
        		wp.element.createElement(wp.components.PanelBody, {
						title: 'Structure'
				}, 
					// Bubble Type
					wp.element.createElement(wp.components.SelectControl, {
						label: 'Bubble Type',
						value: props.attributes.bubbleType,
						options: [
							{label: 'Single', value: 'single'},
							{label: 'Top', value: 'top'},
							{label: 'Middle', value: 'middle'},
							{label: 'Bottom', value: 'bottom'}
						],
						onChange: updateBubbleType
					}),
					// Bubble Alignment
					wp.element.createElement(wp.components.SelectControl, {
						label: 'Alignment',
						value: props.attributes.bubbleAlignment,
						options: [
							{label: 'Right', value: 'right'},
							{label: 'Left', value: 'left'}
						],
						onChange: updateAlignment
					}),
					// Timestamp Toggle
					wp.element.createElement(wp.components.PanelRow, null, 
						wp.element.createElement(wp.components.ToggleControl, {
							label: props.attributes.withTimestamp ? '\nTimestamp Visible' : '\nTimestamp Hidden',
							checked: props.attributes.withTimestamp,
							onChange: updateTimestampVisibility
						})
					)
				),
				// Color Settings
				wp.element.createElement(wp.components.PanelBody, {
					title: 'Colors'
				},
					// Bubble Color
					wp.element.createElement("label", null, 'Bubble Color'), 
					wp.element.createElement(wp.components.PanelRow, null,
						wp.element.createElement(wp.components.ColorPalette, {
							colors: bubbleColors,
							value: props.attributes.bubbleColor,
							onChange: updateBubbleColor
						})
					),
					// Text Color
					wp.element.createElement(wp.components.PanelRow, null,			
						wp.element.createElement("label", {style: {'padding-right': '40px'}}, 'Text Color'), 
						wp.element.createElement(wp.components.ColorPalette, {
							colors: fontColors,
							value: props.attributes.fontColor,
							style: {'margin-right': '5px'},
							onChange: updateFontColor
						})
					)
				)
			), 
			// Timestamp Text
        	wp.element.createElement(wp.blockEditor.RichText, {
        		className: baseClassName + timestampClassNameSuffix,
        		style: getTimestampStyleAttributes(props),
				tagName: "div",
				multiLine: "p",
				placeholder: "Name - 00:00",
				onChange: updateTimestamp,
				value: props.attributes.timestamp
			}),
			// Message Text
        	wp.element.createElement(wp.blockEditor.RichText, {
        		className: baseClassName + bubbleClassNameSuffix,
        		style: getBubbleStyleAttributes(props),
				tagName: "div",
				multiLine: "p",
				placeholder: "Add your message.",
				onChange: updateMessage,
				value: props.attributes.message
			})
		);
	},

    /*
	  Final Block Display
	*/
    save: props => {

    	return wp.element.createElement("div", null, 
    		wp.element.createElement("div", {
    			className: baseClassName + timestampClassNameSuffix,
				style: getTimestampStyleAttributes(props)
			}, props.attributes.timestamp),
    		wp.element.createElement("div", {
    			className: baseClassName + bubbleClassNameSuffix,
				style: getBubbleStyleAttributes(props)
			}, props.attributes.message)
    	);
/*
        return wp.element.createElement("div", {
			style: getBubbleStyleAttributes(props)
		}, props.attributes.message);
*/
    }

});
