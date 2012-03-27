
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
			console.log('new todo created');
			this.bind('error', function(error){
				console.log(error)
			});
		}	
	});

	window.TodoCollection = Backbone.Collection.extend({
		model: Todo,
		localStorage : new Store("ppl07780"),
		initialize:function(){
			console.log('TodoCollection loaded');
		}

	});

	var task = new Array();
	collection  =  new TodoCollection();
	var collectionLoaded = collection.fetch();
	var id = collection.length > 0 ? collection.length+1 : 1;
	if(collection.isEmpty())
	console.log('empty collection')

	$('#newTodo').click(function(){
		task[id] = new Todo({id:id});
		if(collection.add(task[id]))
		console.log('added in collection');
		var taskSaved = task[id].save();
		if(!taskSaved)
		console.log('Fail saving');
		id++;
	});
});
