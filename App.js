Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		// Program Risk Log
		var project_oid = '/project/40886178637';
		
		Ext.create('Rally.data.wsapi.Store', {
			model: 'userstory',
			autoLoad: true,
			context: {
				project: project_oid,
				projectScopeDown: true,
				projectScopeUp: false
			},
			listeners: {
				load: this._onDataLoaded,
				scope: this
			},
			fetch: ['FormattedID', 'Name', 'Owner', 'c_RiskLikelihood', 'c_RiskImpact', 'c_RiskStatus', 'CreationDate']
		});
	},

	_onDataLoaded: function(store, data) {
		
		function formatDate(dateString) {
			if(!dateString) { return ''; }
			thisYear = dateString.getFullYear();
			thisMonth = ("0" + (dateString.getMonth() + 1)).slice(-2);
			thisDay = ("0" + dateString.getDate()).slice(-2);

			thisDate = thisMonth + "/" + thisDay + "/" + thisYear;
			return(thisDate);
		}
		
		var records = _.map(data, function(record) {
			//Perform custom actions with the data here
			if ('' !== record.get('c_RiskLikelihood')){
				var regExp = /\(([^)]+)\)/;
				var matches = regExp.exec(record.get('c_RiskLikelihood'));
				var likely = matches[1];
				var sean = Ext.num(likely);
				//Calculations, etc.
				return Ext.apply({
					Sean: Ext.num(sean * sean)
				}, record.getData());
			}else{
				return Ext.apply({
					Sean: 0
				}, record.getData());
			}
		});

		this.add({
			xtype: 'rallygrid',
			width: '99%',
			showPagingToolbar: false,
			showRowActionsColumn: false,
			editable: false,
			store: Ext.create('Rally.data.custom.Store', {
				data: records
			}),
			columnCfgs: [
				{
					xtype: 'templatecolumn',
					text: 'ID',
					dataIndex: 'FormattedID',
					width: 100,
					tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
				},
				{
					text: 'Name',
					dataIndex: 'Name',
					flex: 1
				},
				{
					text: 'Owner',
					dataIndex: 'Owner',
					renderer: function(value) {
						return value._refObjectName;
					}
				},	
				{
					text: 'Risk Likelihood',
					dataIndex: 'c_RiskLikelihood'
				},
				{
					text: 'Risk Impact',
					dataIndex: 'c_RiskImpact'
				},
				{
					text: 'Exposure (L * I)',
					dataIndex: 'Sean'
				},
				{
					text: 'Risk Status',
					dataIndex: 'c_RiskStatus'
				},
				{
					text: 'Creation Date',
					dataIndex: 'CreationDate',
					renderer: function(value) {
						return formatDate(value);
					}
				}
			]
		});
	}
});
