var paypalAdmin = (function($) {
	
	var loadMask;
	var actionFormWindow;
	var transactionDetailWindow;
	
	function initTextareaCharectersLeft(parent) {
		parent = parent || document;
		$(parent).find('textarea[data-maxcount]').each(function() {
			var $textarea = $(this);
			var maxCount = $textarea.data('maxcount');
			var $countInput = $textarea.parent().find('.js_textarea_count');		
			$countInput.text(maxCount);		
			$textarea.on('keyup', function() {
				var text = $textarea.val();
				var left = maxCount - text.length;
				if(left >= 0) {
					$countInput.text(left);
				}
				$textarea.val(text.slice(0, maxCount));
			});
		});
	}
	
	function initActionFormEvents(parent, action) {
		$(parent).find('form').submit(function() {
			submitActionForm($(this), action);
			return false;
		});
	}
	
	function isFormValid($form) {
		var countErrors = 0;
		$form.find('.paypal_error_msg_box').hide();
		$form.find('.paypal_error_field').removeClass('paypal_error_field');
		$form.find('[data-validation]').each(function() {
			var $field = $(this);
			var rules = $field.data('validation').replace(/\s/, '').split(',');
			var value = $field.val();
			$.each(rules, function(i, rule) {
				switch(rule) {
					case 'required':
						if(!value.replace(/\s/, '').length) {
							countErrors++;
						}
						break;
					case 'float':
						if(isNaN(parseFloat(value)) || !isFinite(value)) {
							countErrors++;
						}
						break;
					case 'greaterzero':
						if(parseFloat(value) <= 0) {
							countErrors++;
						}
						break;
				}
				if(countErrors) {
					$field.parents('tr').addClass('paypal_error_field');
					$form.find('.paypal_error_msg_box_' + $field.attr('name') + '_' + rule).show();
					return false;
				}
			});
		});
		return !!countErrors;
	}
	
	function showErrorMessage(text) {
		Ext.Msg.show({
			title: paypalAdmin.resources.errorMsgTitle,
			msg: text,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.ERROR
		});
	}
	
	function submitCaptureForm($form, responseData) {
		$form.find('[name=methodName]').val('DoCapture');
		$form.find('[name=authorizationId]').val(responseData.transactionid);
		submitActionForm($form, 'capture');
	}
	
	function submitActionForm($form, action) {	
		if(isFormValid($form)) return false;
		
		loadMask.show(action);
		$.ajax({
			url: $form.attr('action'),
			data: $form.serialize(),
			dataType: 'json',
			error: function() {
				loadMask.hide();
				transactionDetailWindow.close();
				actionFormWindow.close();
			},
			success: function(data) {
				loadMask.hide();
				if(data.ack == 'Success' && data.result == 'Success') {		
					if(action == 'sale') {
						submitCaptureForm($form, data);
					}	
					actionFormWindow.close();
					loadOrderTransaction(paypalAdmin.currentOrderNo);
				} else {
					data.l_longmessage0 ? showErrorMessage(data.l_longmessage0) : showErrorMessage(paypalAdmin.resources.serverError);
				}
			}
		});
	}
	
	function initOrderTransaction() {
		paypalAdmin.currentOrderNo = $('.js_paypalbm_order_detail').data('orderno');
		
		$('.js_paypal_action').on('click', function() {
			var $button = $(this);
			var action = $button.data('action');
			var $formContainer = $('#paypal_' + action + '_form');
			var formContainerClass = 'js_paypal_action_form_container_' + action;
			
			actionFormWindow = new Ext.Window({
				title: $button.data('title'),
				width: 700,
				modal: true,
				autoScroll: true,
				cls: 'paypalbm_window_content ' + formContainerClass,
				listeners: {
					render: function() {
						actionFormWindow.body.insertHtml('afterBegin', $formContainer.html());
						initTextareaCharectersLeft(actionFormWindow.body.dom);
						initActionFormEvents(actionFormWindow.body.dom, action);
					}
				},
				buttons: [
					{
						text: paypalAdmin.resources.submit,
						handler: function() {
							submitActionForm($('.' + formContainerClass).find('form'), action);
						}
					},
					{
						text: paypalAdmin.resources.cancel,
						handler: function() {
							actionFormWindow.close();
						}
					}
				]
			});
			actionFormWindow.show();
		});
		
		$('.js_paypalbm_order_transactions_ids').on('change', function() {
			var transactionId = $(this).val();
			loadOrderTransaction(paypalAdmin.currentOrderNo, transactionId);
		});
	}
	
	function loadOrderTransaction(orderNo, transactionId) {
		var data = {
			format: 'ajax',
			orderNo: orderNo
		};
		if(transactionId) {
			data.transactionId = transactionId;
		}
		loadMask.show();
		$.ajax({
			url: paypalAdmin.urls.orderTransaction,
			data: data,
			error: function(data) {
				loadMask.hide();
				transactionDetailWindow && transactionDetailWindow.close();
			},
			success: function(data) {
				loadMask.hide();
				if(transactionDetailWindow) {
					$('#' + transactionDetailWindow.body.id).html(data);
					transactionDetailWindow.setHeight('auto');
					transactionDetailWindow.center();
				} else {
					$('.js_paypalbm_content').html(data);
				}
				initOrderTransaction();
			}
		});
	}
	
	function initEvents() {
		$('.js_paypal_show_detail').on('click', function() {		
			var $button = $(this);
			transactionDetailWindow = new Ext.Window({
				title: $button.attr('title'),
				width: 780,
				height: 200,
				modal: true,
				autoScroll: true,
				cls: 'paypalbm_window_content'
			});
			transactionDetailWindow.show();
			loadOrderTransaction($button.data('orderno'));
			return false;
		});
		
		$('.js_paypalbm_switch').on('click', function() {
			var blockId = $(this).attr('href');
			$('.js_paypalbm_switch_block').hide();
			$(blockId).show();
			return false;
		});
	}
	
	function initLoadMask() {
		loadMask = {
			ext: new Ext.LoadMask(Ext.getBody()),
			show: function(type) {
				this.ext.msg = paypalAdmin.resources.loadMaskText[type] || paypalAdmin.resources.pleaseWait;
				this.ext.show();
			},
			hide: function() {
				this.ext.hide();
			}
		};
	}
	
	return {
		init : function(config) {
			$.extend(this, config);
			$(document).ready(function() {
				initEvents();
				initLoadMask();
				if($('.js_paypalbm_order_detail').size()) {
					initOrderTransaction();
				}
			});
		}
	}
})(jQuery);
