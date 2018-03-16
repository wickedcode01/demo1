var menuLeft = document.getElementById('cbp-spmenu-s1'),
	showLeft = document.getElementById('showLeft'),
	body = document.body;

showLeft.onclick = function() {
	classie.toggle(this, 'active');
	classie.toggle(menuLeft, 'cbp-spmenu-open');
};

$(document).bind('click',function(e){ 
var e = e || window.event; //浏览器兼容性 
var elem = e.target || e.srcElement; 
while (elem) { //循环判断至跟节点，防止点击的是div子元素 
if (elem.id && elem.id=='showLeft') { 
return; 
} 
elem = elem.parentNode; 
} 
if($('#showLeft').attr('class')=='active'){
	classie.toggle(menuLeft, 'cbp-spmenu-open');
	$('#showLeft').removeClass("active");
}


}); 
//图片特效
$(function() {
			
				$(' .thumbnail > div ').each( function() { $(this).hoverdir({
					hoverDelay : 50,
					inverse : true
				}); } );

			});
			
//异步加载
$(document).ready(function(){

	$.ajax({
    url: "/getinfo",
    type: "GET",
    success: function(data){
		var data=JSON.parse(data);
					
		for(var i=0;i<data.length;i++){
			
			$('#section'+i+' .uploader').html("发布者：<a>"+data[i].tname+"</a>");
			$('#section'+i+' .img-box img').remove();
			$('#section'+i+' .img-box').prepend("<img src="+data[i].psrc +" class='art-img'>");
			$('#section'+i+' .details').append("<span>"+data[i].pbi+"</span>");
		}
        
    },
	error: function(data,status){ 
                                if(status == 'error'){ 
                                    alert("当前网络故障，请刷新重试");
                             
                                }
                            }
});
})


