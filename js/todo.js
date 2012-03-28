
$(function(){


	window.Todo = Backbone.Model.extend({
		defaults:{
			id:1,
			title:'Choose a title',
			description:'Write a description...',
			priority:'low',
			created_at: Date.now()
		},
		validate: function(attr){
			if(attr.title == '' || attr.description == '')
			return 'pas cool';
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
		localStorage : new Store("pml0"),
		initialize:function(){
			console.log('TodoCollection loaded');
		}

	});

	window.todoView = Backbone.View.extend({
		el:$('#todoBox'),
		initiliaze:function(){
			this.template = _.template('#todoTemplate').html();
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
		},
		setModel:function(model){
			this.model = model;
			return this;
		},
		render:function(){
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
	});

	var task = new Array();
	var collection  =  new TodoCollection();
	collection.fetch();
	var id = collection.length > 0 ? collection.length+1 : 1;
	if(collection.isEmpty())
	console.log('Empty Collection');



	$('#newTodo').click(function(){
		task[id] = new Todo({id:id});
		if(collection.add(task[id]))
		console.log('added in collection');
		var taskSaved = task[id].save();
		if(!task[id].save)
		console.log('Fail saving');
		else
		console.log('Successfully saved!')
		id++;
	});

	$('#todoBox #title').click(function(){
		var positionMin = "-4px";
		var positionMax = "-60px";
		var offset = $('#modifyInputBox').offset();
		$('#save').removeClass('disabled')
		if($(this).text() === $('#modifyInput').val() || $('#modifyInput').val() == ''){
			if(offset.top === parseInt(positionMin)){
				$('#modifyInputBox').animate({'top':positionMax})
				$('#modifyInput').val('');
			}else{
				$('#modifyInputBox').animate({'top':positionMin})
				$('#modifyInput').val($(this).text()).focus().select();
			}
		}else {
			$('#modifyInput').val($(this).text()).focus().select();
		}
	});

	$('#save').click(function(){
		$(this).addClass('disabled')
		setTimeout("$('#modifyInputBox').animate({'top':positionMax})",1000)
	})

/*Small activity tracker checking mouse movement*/
window.idle = false;
var inactivity = 60000;
tidle=setTimeout(function(){window.idle = true;}, inactivity);
/*hide element if idle*/
setInterval(function(){if(window.idle) $('body').animate({'opacity':'0'})}, 1000)

$(document).mousemove(function(){
	window.idle = false;
	if($('body').css('opacity') === '0')
	$('body').animate({'opacity':'1'});
	clearTimeout(tidle);
	setTimeout(function(){window.idle = true}, inactivity);	
});


});