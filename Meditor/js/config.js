	//	Start By 2013/10/14
	//	Write By MiCoo
	//	Last edite 2013/12/05
/*
 *	
 *	
 *	样式集中配置于 setStyle 方法中
 *	
 *	使用方法：
 *	
 *	1. 初始化：				var Aeditor = new Meditor('toolBar');
 *	2. 设置监听函数：		Aeditor.listener(fn);								//添加对编辑区的监听事件，内容若变化就触发
 *	3. 绑定预览区：  		Aeditor.bindShowBoard(obj);							//预览区可切换，但同时只能有一个
 *	4. 获取当前编辑区内容：	Aeditor.getData();									//返回的是一串含标签的html字符串
 *	5. 设置预览区的值： 	Aeditor.getData('hahahhahahaha');					
 *
*/

/*
 *
 *	将不需要的功能注释掉就可以了
 *	
 *
 *	！！！！一定要注意不能多或少了逗号！！！！
 *
 *
 *
 *
 *
 *
*/

Meditor.prototype.setToolbar = function(){
	this.setting = {
				'block1' : {
					'bold' : {'title' : '粗体'},
					'italic' : {'title' : '斜体'},
					'underline' : {'title' : '下划线'}//,
					// 'strikeThrough' : {'title' : '删除线'}
				},
				'block2' : {
					'insertunorderedlist' : {'title' : '无序列表'},
					'insertorderedlist' : {'title' : '有序列表'},
					'indent' : {'title' : '缩进'},
					'outdent' : {'title' : '取消缩进'}
				},
				'block3' : {
					'justifyLeft' : {'title' : '居左'},
					'justifyCenter' : {'title' : '居中'},
					'justifyRight' : {'title' : '居右'}
				},
				'block4' : {
					'undo' : {'title' : '撤销'},
					'redo' : {'title' : '重做'}
				},
				'block5' : {
					'createLink' : {'title' : '添加链接'},
					'unlink' : {'title' : '去除链接'}
				},
				'block6' : {
					'insertImage' : {'title' : '插入图片'}
				},
				'block7' : {
					'removeFormat' : {'title' : '格式化'}
				},
				'fontname' : {
					'SimSun' : '宋体',
					'仿宋' : '仿宋',
					'\\96B6\\4E66' : '隶书',
					'KaiTi_GB2312' : '楷体',
					'\\5E7C\\5706' : '幼圆',
					'SimHei' : '黑体',
					'Microsoft YaHei' : '雅黑',
					'Arial' : 'Arial',
					'Georgia' : 'Georgia',
					'Tahoma' : 'Tahoma',
					'Times New Roman' : 'Times New Roman',
					'Verdana' : 'Verdana',
					'Courier' : 'Courier',
					'Comic Sans MS' : 'Comic Sans MS'
				},
				'fontsize' : {
			        '7' : '48px',
			        '6' : '32px',
			        '5' : '24px',
			        '4' : '18px',
			        '3' : '16px',
			        '2' : '12px',
			        '1' : '10px'
		      	},
			    'forecolor' : {
			    	'#ffffff' : '白色',
			        '#000000' : '黑色',
			        '#ff0000' : '红色',
			        '#00ff00' : '绿色',
			        '#0000ff' : '蓝色'
			    },
			    'backcolor' : {
			        //'#fff' : '背景',
			        '#ffffff' : '白色',
			        '#ff0000' : '红色',
			        '#00ff00' : '绿色',
			        '#0000ff' : '蓝色',
			        '#000000' : '黑色'
			    }
			};
}