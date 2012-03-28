
$(function(){

	window.Todo = Backbone.Model.extend({
		defaults:{
			id:1,
			title:'Choose a title',
			description:'Write a description...',
			priority:'low',
			created_at: Date.now()
		},
		initialize:function(){
			console.log('New todo created!');
			this.bind('error', function(error){
				console.log(error)
			});
		}	
	});

	window.TodoCollection = Backbone.Collection.extend({
		model: Todo,
		localStorage : new Store("pml0llgg"),
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
			this.collection.bind('change', this.render);
			console.log('View Loaded');
			this.bind('error', function(error){
				console.log(error)
			});
		},
		setModel:function(model){
			this.model = model;
			return this;
		},
		render:function(){
			var renderedContent = this.template({all: this.collection.toJSON()});
			$(this.el).html(renderedContent);
			return this;
		}
	});
	
	//Initialize the page
	var task = new Array();
	var c  =  new TodoCollection();
	c.fetch();	
	var id = c.length > 0 ? c.length+1 : 1;
	var field_type, field_id, todo = '';
	var edited = false;
	$('#modifyInput').val('')
	if(c.isEmpty())
	console.log('Empty Collection');
	else{
		var v = new todoView({collection:c})
		v.render()
	}
	
	var createNewTodo = function(){
		task[id] = new Todo({id:id});
		if(c.add(task[id]))
		console.log('added in collection');
		var taskSaved = task[id].save();
		if(!task[id].save)
		console.log('Fail saving');
		else
		console.log('Successfully saved!')
		id++;
	}

	var getFieldInfo = function(that){
		field_type = $(that).attr('id');
		field_id = $(that).parent().children("#id").text();
	}

	var sendFieldInfoToInput = function(){
		var elem = $('#modifyInput');
		elem.attr({'data-id':field_id, 'data-type':field_type})
	}

	var toggleEditBox = function(that){	
		var positionDown = "-4px";
		var positionUp = "-60px";
		var offset = $('#modifyInputBox').offset();
		$('#save').removeClass('disabled');
		if($(that).text() === $('#modifyInput').val() || $('#modifyInput').val() == ''){
			if(offset.top === parseInt(positionDown)){
				$('#modifyInputBox').animate({'top':positionUp})
				$('#modifyInput').val('');
			}else{
				$('#modifyInputBox').animate({'top':positionDown})
				$('#modifyInput').val($(that).text()).focus().select();
			}
		}else {
			$('#modifyInput').val($(that).text()).focus().select();
		}
	}

	// ----------- Triggers ---------------

	$('#save').click(function(){
		$(this).addClass('disabled')
		setTimeout("$('#modifyInputBox').animate({'top':'-60px'});$('#modifyInput').val('');",1000)
		
		todo.save();
		edited = true;	
	});

	$('#modifyInput').keyup(function(){
		//error here
		edited =true;
		todo = todo === 'undefined' ? c.get(field_id) :todo;
		console.log(todo)
		switch(field_type){
			case 'title':
			todo.set({'title':$(this).val()});
			break;
			case 'description':
			todo.set({'description':$(this).val()});
			break;
		}
	})

	$('#todoBox #title, #todoBox #description').click(function(){
		getFieldInfo(this);
		sendFieldInfoToInput();
		toggleEditBox(this);
		todo = c.get(field_id);
	});

	$('#newTodo').click(function(){
		createNewTodo();
	});

/*Small activity tracker checking mouse movement*/
window.idle = false;
var inactivity = 60000;
tidle=setTimeout(function(){window.idle = true;}, inactivity);
/*hide element if idle*/
setInterval(function(){if(window.idle && $('body').css('opacity') === '1') $('body').animate({'opacity':'0'})}, 1000)

$(document).mousemove(function(){
	window.idle = false;
	if($('body').css('opacity') === '0')
	$('body').animate({'opacity':'1'});
	clearTimeout(tidle);
	setTimeout(function(){window.idle = true}, inactivity);	
});


});