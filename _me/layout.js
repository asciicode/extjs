Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux');

Ext.require([
    'Ext.tip.QuickTipManager',
    'Ext.container.Viewport',
    'Ext.layout.*',
    'Ext.form.Panel',
    'Ext.form.Label',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.selection.*',
    'Ext.tab.Panel',
    'Ext.ux.layout.Center'  
]);

Ext.onReady(function(){
	Ext.tip.QuickTipManager.init();
	
	function clearExtjsComponent(cmp) {
	    var f;
	    console.log(cmp.items)
	    while(f = cmp.items.first()){
	        cmp.remove(f, true);
	    }
	}
	
	function replaceComponentContent(cmpParent, cmpContent) {
    	clearExtjsComponent(cmpParent);
    	cmpParent.add(cmpContent);
    	cmpParent.doLayout();
	}

	var contentPanel = {
         id: 'content-panel',
         region: 'center', // this is what makes this panel into a region within the containing layout
         layout: 'fit',
         margins: '2 5 5 0',
         activeItem: 0,
         border: false,
         items: [{
             xtype:'panel',	 
        	 id: 'start-panel',
             title: 'Start Page',
             layout: 'fit',
             bodyStyle: 'padding:25px',
             contentEl: 'start-div'  // pull existing content from the page
         }]
	};
	
	var tmpPanel = {
		 xtype:'panel',	 
		 id: 'start-panel',
		 title: 'Start Tmp Page',
		 layout: 'fit',
		 bodyStyle: 'padding:25px',
		 html: 'start-div'  // pull existing content from the page
	 };
	
	var store = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true
        },
        proxy: {
            type: 'ajax',
            url: 'tree-data.json'
        }
    });
	
	var treePanel = Ext.create('Ext.tree.Panel', {
        id: 'tree-panel',
        title: 'Sample Layouts',
        // region:'north',
        // split: true,
        height: '100%',
        // minSize: 150,
        rootVisible: false,
        autoScroll: true,
        store: store
    });
	
	treePanel.getSelectionModel().on('select', function(selModel, record, index, eOpts){
		console.log(selModel);
		console.log(record)
		if (record.get('leaf')){
			var node = { params: { clientId: 'clientId' , clientName: 'clientName', layoutName: "ClientLayout" }};
		    
            // Ext.apply( config, attri );
            // var p = Ext.ComponentMgr.create(config, 'panel');
            // console.log(Ext.getCmp('content-panel'));
            // console.log(Ext.getCmp('start-panel'));
            // console.log(p);
            // Ext.getCmp('content-panel').add( config );
 	    	// Ext.getCmp('content-panel').doLayout();
 	    	// replaceComponentContent(Ext.getCmp('content-panel'), tmpPanel)
 	    	// replaceComponentContent(Ext.getCmp('content-panel'), config)
 	    	// Ext.getCmp('viewId').remove(Ext.getCmp('content-panel'));
 	    	// Ext.getCmp('viewId').add(contentPanel);
 	    	// Ext.getCmp('viewId').doLayout();
 	    	va = Ext.getCmp('content-panel')
 	    	Ext.Ajax.request({
	            url: record.get('id')+'.json'
	            ,success: function( resp ){
                    var config1 = Ext.decode( resp.responseText );
                    console.log('ajax success')
                    console.log(this.renderUI);
                    console.log(node);
                    // console.log(callback);
                    console.log(config1);
                    // this.renderUI.createDelegate(this, [path, node , callback, config1])();
                    // Ext.bind(this.renderUI, this, [path, node , callback, config1]);
					// this.renderUI(path,node,callback,config1);
		            
		            var attr = {
						itemId         : node.id
						,header        : this.showHeader
						,screenHeader  : this.showScreenHeader
						,title         : node.text
						,iconCls       : (node.attr) ? node.attr.iconCls : node.iconCls
						// ,bodyStyle     : "padding:10px"
						,autoDestroy   : true               
					};
					//this.removeAll();
					var p = Ext.ComponentMgr.create( config1, 'panel' ); 
					//this.add( p );
 	    			//this.doLayout();
					replaceComponentContent(Ext.getCmp('content-panel'), p);
					
	            }
	            ,scope:this
	        });
            console.log('end select')
		}
	});
	
	var main = new MainPanel({
        id : "main"
        ,margins: "5 5 5 0"
        ,layout: "fit"
        ,showScreenHeader:false
    })
    var xtplWin = Ext.create("Ext.Window",{
		title : 'Template',
		id: 'xtplWin',
		width : 320,                            
		height: 180,
		// closable : false,                           
		// html : 'A window that is a modal!',                         
		modal : true
		,tpl: new Ext.XTemplate("<tpl><table><tr><td>Test :</td><td>&nbsp;{test}</td></tr><tr><td>Field :</td><td>&nbsp;{field}</td></tr></table></tpl>")
		,data: Ext.create('Ext.data.ArrayStore', {
			test: 'Don Griffin',
			field: 'Senior Technomage'
		})
		//,tplWriteMode: 'overwrite'
		//,renderTo: Ext.getBody()
		/*,items:[{
			xtype : 'panel'
			,title: 'test'
			,layout: 'card'
			,tpl : new Ext.XTemplate("<tpl><div> asdf </div></tpl>")
			,data : ""
		}]*/
		,buttons: [{
			text: 'Submit'
			,listeners: {
				click : {
					fn : function(){
						// btnHiFlag = true;
						console.log(Ext.getCmp('submitHide').fireEvent("click"));
					}
				} 
			}
		},{
			text: 'Cancel'
			,listeners: {
				click : {
					fn : function(){
						Ext.getCmp('xtplWin').hide();
					}
				}
			}
		}]
	});
	var btnHiFlag = false; 
    var sayHi = function(name){
		// Note this use of "this.text" here.  This function expects to
		// execute within a scope that contains a text property.  In this
		// example, the "this" variable is pointing to the btn object that
		// was passed in createDelegate below.
		// alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
		Ext.create("Ext.Window",{
			title : 'Extra window!',
			width : 350,                            
			height: 200,
			// closable : false,                           
			// html : 'A window that is a modal!',                         
			modal : true
			,items : [{
				xtype : "fieldset"
				,layout : "form"
				,border : false
				,items : [{
					xtype : "textfield"
					,fieldLabel : "Test"
					,name : "test"
					,id : "test"
				},{
					xtype : "textfield"
					,fieldLabel : "Field"
					,name : "field"
					,id : "field"
				}]
			}],
			buttons: [{
				text: 'Submit'
				,id: 'submitHi'
				,listeners: {
					click : {
						fn : function(){
							console.log(Ext.getCmp("test").getValue())
							var data = Ext.create('Ext.data.ArrayStore', {
								test: Ext.getCmp("test").getValue(),
								field: Ext.getCmp("field").getValue()
							})
							xtplWin.update(data);
							xtplWin.show();
						}
					} 
				}
			},{
				text: 'Submit Hide'
				,id: "submitHide"
				,hidden: true	
				,listeners:{
					click:{
						fn : function(){
							alert('submit gkan sa hide button');
						}
					}
				}
			},{
				text: 'Cancel'
			}]
			
		}).show();
	}
	
	var btn = new Ext.Button({
		text: 'Say Hi',
		renderTo: Ext.getBody()
	});
	
	btn.on('click', Ext.bind(sayHi, btn, ['Fred']));

	Ext.create('Ext.Viewport', {
        layout: 'border',
        title: 'Ext Layout Browser',
        id: 'viewId',
        items: [{
            xtype: 'box',
            id: 'header',
            region: 'north',
            html: '<h1> Ext.Layout.Browser</h1>',
            height: 30
        },{
            layout: 'border',
            id: 'layout-browser',
            region:'west',
            border: false,
            split:true,
            margins: '2 0 5 5',
            width: 275,
            minSize: 100,
            maxSize: 500,
            items: [treePanel]
        }, 
            contentPanel
        ],
        renderTo: Ext.getBody()
    });
});
