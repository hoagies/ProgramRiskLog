Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		// Radian
		var project_oid = '/project/37192747640';

		this.add({
			xtype: 'rallycombobox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('initiative'),
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity,
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				}
			},
			listeners: {
				// select: this._onSelect,
				select: this._onLoad,
				ready: this._onLoad,
				scope: this
			}
		});
	},
		
	_onLoad: function() {
		var project_oid = '/project/37192747640';
		
		if (this.down('#features')) {
			this.down('#features').destroy();
		}
		
		this.add({
			id: 'features',
			xtype: 'rallygridboard',
			modelNames: ['PortfolioItem/Feature'],
			toggleState: 'board',
			context: this.getContext(),
			storeConfig: {
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				},
				filters: [this._getFilter()]
			},
			// columnConfig: {
				// plugins: [
					// {ptype: 'rallycolumncardcounter'}
				// ]
			// },
            cardBoardConfig: {
                attribute: 'State',
				fetch: ['Project', 'PercentDoneByStoryCount'],
				cardConfig: {
					xtype: 'rallycard',
					fields: ['State','Project'],
					showIconsAndHighlightBorder: false,
					editable: false,
					showAge: true
				},
				columnConfig: {
					plugins: [
						{ptype: 'rallycolumncardcounter'}
					]
				}
				// plugins: [{ptype:'rallyfixedheadercardboard'}]
            },
			plugins: [
				{
					ptype: 'rallygridboardfieldpicker',
					modelNames: ['PortfolioItem/Feature'],
					headerPosition: 'left'
				}, {
                    ptype: 'rallygridboardcustomfiltercontrol',
					headerPosition: 'left',
                    filterControlConfig: {
						modelNames: ['PortfolioItem/Feature']
					}
                }
			]
		});
	},
		
	_getFilter: function() {
		var combo = this.down('rallycombobox');
		return {
			property: 'Parent.Parent',
			operator: '=',
			value: combo.getValue()
		};
	}

});