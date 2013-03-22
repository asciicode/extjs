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

//
// This is the main layout definition.
//
Ext.onReady(function(){
	console.log('allen');
	Ext.create('Ext.panel.Panel', {
		renderTo: Ext.getBody(),
        id:'column-panel',
        title: 'Column Layout',
        layout: 'column',
        bodyStyle: 'padding:5px 0 5px 5px',
        margins:'35 5 5 0',
        defaults: {bodyStyle:'padding:15px'},
        items: [{
            columnWidth: '.30',
            baseCls:'x-plain',
            bodyStyle:'padding:5px 0 5px 5px',
            items:[{
                title: 'A Panel',
                html: '<p>This is some short content.</p>'
            }]
        },{
            columnWidth: '.65',
            baseCls:'x-plain',
            bodyStyle:'padding:5px 0 5px 5px',
            items:[{
                title: 'A Panel',
                html: '<p>This is some short content.</p>'
            }]
        }]
    });
});