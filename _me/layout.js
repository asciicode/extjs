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
	    while(f = cmp.items.first()){
	        cmp.remove(f, true);
	    }
	}
	
	var contentPanel = {
         id: 'content-panel',
         region: 'center', // this is what makes this panel into a region within the containing layout
         layout: 'card',
         margins: '2 5 5 0',
         activeItem: 0,
         border: false,
         items: [{
        	 id: 'start-panel',
             title: 'Start Page',
             layout: 'fit',
             bodyStyle: 'padding:25px',
             contentEl: 'start-div'  // pull existing content from the page
         }]
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
        region:'north',
        // split: true,
        height: '100%',
        // minSize: 150,
        rootVisible: false,
        autoScroll: true,
        store: store
    });
	
	treePanel.getSelectionModel().on('select', function(selModel, record, index, eOpts){
		console.log(contentPanel);
		if (record.get('leaf')){
			// clearExtjsComponent(contentPanel)
			/*contentPanel.update('');

			// add the new component
			contentPanel.add(newPanel);

			// redraw the containing panel
			contentPanel.doLayout();*/
			
			dynamicPanel = new Ext.Component({
				loader: {
					url: 'me.html',
					renderer: 'html',
					autoLoad: true,
					scripts: true
	            }
			});

			Ext.getCmp('content-panel').add(dynamicPanel);
		
		}
	});
	
	
	Ext.create('Ext.Viewport', {
        layout: 'border',
        title: 'Ext Layout Browser',
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
