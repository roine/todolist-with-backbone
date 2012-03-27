
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
		localStorage : new Store("pml"),
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
	else{


	}


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
		var position = -2;
		var offset = $('#modifyInputBox').offset();
		console.log(offset.top+', '+position)
		if(offset.top === position){
			$('#modifyInputBox').animate({'top':'-100px'})
		}else if(offset.top !== position){
			$('#modifyInputBox').animate({'top':'-2px'})
			$('#modifyInput').val($(this).text()).focus().select();

		}
	});

	$('#save').click(function(){
	})
});
