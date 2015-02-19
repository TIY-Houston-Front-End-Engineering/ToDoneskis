;(function(exports){

    "use strict";

    // dummy data
    var data = [{
        description: "take out the trash"
    }, {
        description: "walk the cat"
    }, {
        description: "troll noobs",
        isDone: true
    }, {
        description: "win at ping pong",
        urgent: true
    }]

    Backbone.TodoRouter = Backbone.Router.extend({
        initialize: function(){
            this.collection = new Backbone.TodoList(data);

            this.view = new Backbone.TodoView({
                collection: this.collection
            });

            Backbone.history.start();
        },
        routes: {
            "*default": "home"
        },
        home: function(){
            this.view.render();
        }
    })

    Backbone.TodoView = Backbone.TemplateView.extend({
        el: ".container",
        view: "app",
        events: {
            "submit form": "addTask",
            "change input[name='urgent']": "toggleUrgent",
            "change input[name='isDone']": "toggleIsDone",
            "keyup .description": "setDescription"
        },
        addTask: function(e){
            e.preventDefault();
            var data = {
                description: this.el.querySelector('input').value
            }
            this.collection.add(data);
        },
        getModelAssociatedWithEvent: function(e){
            var el = e.target,
                li = $(el).closest('li').get(0),
                cid = li.getAttribute('cid'),
                m = this.collection.get(cid);

            return m;
        },
        toggleUrgent: function(e){
            var m = this.getModelAssociatedWithEvent(e);
            if(m){
                m.set('urgent', !m.get('urgent'));
                this.collection.sort();
                this.render();
            }
        },
        toggleIsDone: function(e){
            var m = this.getModelAssociatedWithEvent(e);
            if(m){
                m.set('isDone', !m.get('isDone'));
                if(m.get('isDone')){ // if setting to 'done', set 'urgent' to false
                    m.set('urgent', false);
                }
                this.collection.sort();
                this.render();
            }
        },
        setDescription: function(e){
            var m = this.getModelAssociatedWithEvent(e);
            m && m.set('description', e.target.innerText);
        }
    })

    Backbone.Task = Backbone.Model.extend({
        defaults: {
            isDone: false,
            urgent: false,
            dueDate: null,
            tags: [],
            description: "no description given"
        }
    })

    Backbone.TodoList = Backbone.Collection.extend({
        model: Backbone.Task,
        comparator: function(a, b){
            // if a is 'urgent', -1 (a comes before b)
            if(a.get('urgent') && !b.get('urgent') || !a.get('isDone') && b.get('isDone')) return -1;
            // if a 'isDone', 1 (a comes after b)
            if(a.get('isDone') && !b.get('isDone') || !a.get('urgent') && b.get('urgent')) return 1;

            return a.get('description') > b.get('description') ? 1 : -1;
        }
    })

})(typeof module === "object" ? module.exports : window)