/*
    Class: MainPanel
    
    Extension of <Ext.Panel> A core class extension for both AG Capital and Security Admin. It Defines the interface for loading screen dynamically via ajax call
*/
MainPanel = Ext.extend( Ext.Panel, {
    region:'center'
    ,margins:'5 5 5 0'
    ,defaults:{ border:false}
    ,showScreenHeader:true
    ,showHeader:true
    ,url: ""
    ,initComponent: function(){
    	this.addEvents("aftercreation");
    	MainPanel.superclass.initComponent.apply(this, arguments);
    }
    
	/*
	    Function: loadJSON
	    Parameters:
	    
	    path - url string path of the json config object to generate from.
	    node - node information about the screen it contains "Title", "NodeId" and "Parameters".
	    callback - a function to invoke after successful ajax call execution.
	    
	*/
   ,convertStrToObj: function(str, arrayDelimeter, objDelimeter)
	{
		var vars = [];
		var obj = {};
		var queryArray = str.split( arrayDelimeter );
		for(var i = 0; i < queryArray.length; i++)
		{
			vars = queryArray[i].split( objDelimeter );
			obj[vars[0]] = vars[1]
			
		}
		return obj;
	}    
    ,loadJSON: function(path,node,callback){
        //this.loadMask = new Ext.LoadMask( this.body, {msg:"Loading...Please wait..."});
        //this.loadMask.show();
        
        this.setRequestedURL(path);//added to access parameters for report menu items
        
        if( typeof(node.static) != 'undefined' && node.static == true ){
            var config = {
            	xtype: "panel"
            	,border:false
            	,defaults:{ border:false }
            	,items:[{
            		autoLoad: {
            			url: path
            			,scripts: ( typeof node.scripts != 'undefined' ) ? true:false
            		}
            	}]
            }
            this.renderUI( path, node , callback, config );
        }else{        
	        Ext.Ajax.request({
	            url: path
	            ,success: function( resp ){
                    var config1 = Ext.decode( resp.responseText );
                    console.log('ajax success')
                    console.log(this.renderUI);
                    console.log(node);
                    console.log(callback);
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
					this.removeAll();
					var p = Ext.ComponentMgr.create( config1, 'panel' ); 
					this.add( p );
 	    			this.doLayout();
					
					
	            }
	            ,scope:this
	        });
        }
    }
    /*
        Function: renderUI
        Parameters:
        
        path - url string path of the json config object to generate from.
        node - node information about the screen it contains "Title", "NodeId" and "Parameters".
        callback - a function to invoke after successful ajax call execution.
        
    */      
    ,renderUI: function(path,node,callback,config){
    	alert('renderUI')
	    var p = null;
	    var attr = {
	        itemId         : node.id
	        ,header        : this.showHeader
	        ,screenHeader  : this.showScreenHeader
	        ,title         : node.text
	        ,iconCls       : (node.attr) ? node.attr.iconCls : node.iconCls
	        ,bodyStyle     : "padding:10px"
	        ,autoDestroy   : true               
	    };

	    if( typeof node.params != 'undefined' ) {
	        Ext.apply( config, { params : node.params });
	    }
	   
	    p = this.activeScreen || this.get(0);               
	    if( typeof p != 'undefined' && typeof p.countDownInterval != 'undefined' ){
	       clearInterval( p.countDownInterval );
	    }
	    
	    //If there is unsaved changes on the order entry stop loading
	    var proceedLoad = this.checkDirtyFields(p,config,attr,callback);	   	    
	    if (!proceedLoad)
	    	return false;
	    	    
	    
    }
    ,resumeLoadingPage : function (p,config,attr,callback){
    	 try{
 	        this.removeAll( true );
 	    }catch(e){
 	        p.el.remove();
 	    }	    	    	   
 	    // this.setHeader( config, attr )
        this.activeScreen = p = Ext.ComponentMgr.create( this.setHeader( config, attr ) );
 	    this.fireEvent( "aftercreation", p );
 	                    
 	    if( !p ) { return false; }
 	    
 	    this.add( p );
 	    this.doLayout();	    	   
 	
 	    if( Ext.isFunction( callback ) ){
 	        callback.createDelegate( p )();
 	    }
    }
    
    /*
        Function: setHeader
        Parameters:
        
        config - json object configuration screen.
        attributes - node information about the screen it contains "Title", "NodeId" and "Parameters".
        
        Returns:
        json config object with headers set. 
    */  
    ,setHeader: function(config,attributes)
    {
        if (typeof attributes['screenHeader'] != 'undefined' && attributes['screenHeader'] == true) {
        	if( typeof attributes['title'] != 'undefined'){
                var header = [];
	        	
	        	header = {
	        		xtype: 'box'
	        		,cls: "title"
	        		,autoEl: {
	        			tag: 'h1'
	        			,html: attributes.title
	        		}
	        	};
	        	
	        	if(config){
		        	if( typeof config["items"] != 'undefined'){
		        	  config["items"].unshift( header );
		        	}else{
		        	  config['items'] = [];
		        	  config['items'].push( header );
		        	}  
		        	console.log(config);
		        	console.log(attributes);
		        	Ext.apply(config, attributes);
		        	console.log(config);
	        	}
        	}
        }
        
    	Ext.apply( config, attributes );
        return config;  
    },
    setRequestedURL: function(url){
    	this.url=url;
    },
    getRequestedURL: function(){
    	return this.url;
    },
    checkDirtyFields : function(p,config,attr,callback){
    	var continueLoad = true;
    	var thisWindow = this;
    	if (this.activeScreen)
 	    {	    	
 	    	try
 	    	{
 		    	var form = this.activeScreen.getForm();		 		    	
 		    	if (this.activeScreen.fieldChanged) {
 		    		continueLoad = false;
 		    		//continueLoad = confirm("Are you sure to discard the changes made to this transaction ?");
 		    		Ext.Msg.show({
 		    		   title:'Leaving the page',
 		    		   msg: 'Are you sure to discard the changes made to this transaction ?',
 		    		   buttons: Ext.Msg.YESNOCANCEL,
 		    		   //fn: processResult,
 		    		   fn : function(a) { 		    			   
 		    			   //console.log(a)
 		    			   if ("yes" == a)
 		    				  thisWindow.resumeLoadingPage(p,config,attr,callback);
 		    		   },
 		    		   animEl: 'elId',
 		    		   icon: Ext.MessageBox.QUESTION
 		    		});
 		    	}
 	    	}catch(e){continueLoad = true;}
 	    }
    	//return continueLoad;
    	if (continueLoad)
    		this.resumeLoadingPage(p,config,attr,callback);
    }
});