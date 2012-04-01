
$(function(){

	window.Todo = Backbone.Model.extend({
		defaults:{
			id:1,
			title:'Choose a title',
			description:'Write a description...',
			priority:'low',
			created_at: Date.now()
		},
		initialize:function(a){
			console.log('New todo created!');
			this.bind('error', function(error){
				console.log(error)
			});
		}	
	});

	window.TodoCollection = Backbone.Collection.extend({
		model: Todo,
		localStorage : new Store("sophie"),
		initialize:function(){
			console.log('TodoCollection loaded');
			this.bind('error', function(error){
				console.log(error)
			});
		}

	});

	window.todoView = Backbone.View.extend({
		el:$('#wrap'),
		initialize:function(){
			this.template = _.template($('#todoTemplate').html());
			_.bindAll(this, 'render');
			this.collection.bind('change',this.render);
			this.collection.bind('add', this.render);
			console.log('View Loaded');
			this.bind('error', function(error){
				console.log(error)
			});
			
		},
		events:{
			"click #newTodo": "createTodo",
			"click #todoBox #title, #todoBox #description": "toggleEditBox",
			"keyup #modifyInput": "editTodo",
			"slidechange #priority": "editPriority"
		},
		createTodo:function(){
			var todo = new Todo({id:id})
			c.add(todo);
			todo.save();
			id++;
		},
		toggleEditBox:function(e){
			var text = e.target.innerHTML;
			var positionDown = "-4px";
			var positionUp = "-60px";
			var offset = $('#modifyInputBox').offset();
			var previous_id = $('#modifyInput').attr('data-id');
			var previous_type = $('#modifyInput').attr('data-type');
			// get id and field type
			field_type = $(e.currentTarget).attr('id');
			field_id = parseInt($(e.currentTarget).parent().children("#sub").children("#id").text());
			// set id and field type to the modifyInput

			$('#save').removeClass('disabled');
			$('#modifyInput').attr({'data-type':field_type, 'data-id': field_id});
			if((field_type == previous_type &&  field_id == previous_id) || $('#modifyInput').val() == '' && !editing){
				if(offset.top === parseInt(positionDown)){
					$('#modifyInputBox').animate({'top':positionUp})
					$('#modifyInput').val('');
				}else{
					$('#modifyInputBox').animate({'top':positionDown})
					$('#modifyInput').val(text).focus().select();
				}
			}else {
				$('#modifyInput').val(text).focus().select();
			}
		},
		editTodo:function(e){
			var t = c.get(field_id);
			var elem = $('#modifyInput');
			if(e.keyCode === 13){
				if(field_type == 'title')
				t.set({'title': elem.val()})
				else if(field_type == 'description')
				t.set({'description': elem.val()})
			}
			t.save();
		},
		editPriority:function(e,u){
			var previous = $('#todoBox').is('.low') ? 1 : $('#todoBox').is('.mid') ? 2 : $('#todoBox').is('.high') ? 3 : 1;
			var field_id = $(e.currentTarget).parent().parent().attr('data-id');
			prio = u.value == 3 ? 'high' : u.value == 2 ? 'mid' : u.value == 1 ? 'low' : 'low'
			var t = c.get(field_id);
			t.set({'priority': prio})
			t.save();	
		},
		setModel:function(model){
			this.model = model;
			return this;
		},
		render:function(){
			var renderedContent = this.template({all: this.collection.toJSON().reverse()});
			$(this.el).html(renderedContent);
			return this;
			
		}
	});

	//Initialize the page
	var task = new Array();
	var c  =  new TodoCollection();
	c.fetch();	
	var id = c.length > 0 ? c.length+1 : 1;
	var field_type, field_id;
	var editing = false;
	$('#modifyInput').val('')
	if(c.isEmpty())
	console.log('Empty Collection');
	var v = new todoView({collection:c})
	v.render()


	// ----------- Triggers ---------------

	// $('#save').click(function(){
		// 		$(this).addClass('disabled')
		// 		setTimeout("$('#modifyInputBox').animate({'top':'-60px'});$('#modifyInput').val('');",1000)
		// 
		// 		todo.save();
		// 		editing = true;	
		// 	});



/*

window.idle = false;
var inactivity = 60000;
tidle=setTimeout(function(){window.idle = true;}, inactivity);

setInterval(function(){if(window.idle && $('body').css('opacity') === '1') $('body').animate({'opacity':'0'})}, 1000)

$(document).mousemove(function(){
window.idle = false;
if($('body').css('opacity') === '0')
$('body').animate({'opacity':'1'});
clearTimeout(tidle);
setTimeout(function(){window.idle = true}, inactivity);	
});
//*/
	$("#todoBox #left #priority").each(function(i, e){
		var actualPriority = $(this).parent().parent().attr('class');
		var actualPriorityToLetter = actualPriority === 'low' ? 1 : actualPriority === 'mid' ? 2 : actualPriority === 'high' ? 3 : 1;
		console.log(actualPriority);
	$(this).slider({'orientation':'vertical', 'min':1, 'max':3, 'value': actualPriorityToLetter});
})

//$("#priority").slider({'orientation':'vertical', 'min':1, 'max':3, 'value': actualPriority});

/*end of onload*/
});

var formattedDate =function(ts){
	var date, hours, minutes, date1, day, day_array, month, month_array, year = '';
	date = new Date(ts);
	hours = date.getHours();
	minutes = date.getMinutes();
	minutes = minutes < 10 ? '0'+minutes : minutes;
	date1 = date.getDate();
	day_array = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	day = day_array[date.getDay()];
	month_array = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	month = month_array[date.getMonth()];
	year = date.getFullYear();
	return 'Created at '+hours+':'+minutes+', '+day+' '+date1+' '+month+' '+year;
}
