/**
 * Created by DXZ-Weijiu.Wang on 2017/6/14.
 */
"use strict";
/*
 jQuery+Bootstrap 校验表单 by Miaoqiyuan.cn
 原理：http://www.miaoqiyuan.cn/p/jquery-bootstrap-vaild
 演示：http://www.miaoqiyuan.cn/products/vaild/index.html
 源码：http://www.miaoqiyuan.cn/products/vaild/jQuery.Vaild.js
 */
(function(jQuery){
  $.extend({
    Vaild : function(_this){
      if( !!$(_this).data("vaild") ){
        var pattern = new RegExp($(_this).data("vaild"));
        if( pattern.test( $(_this).val() ) ){
          $(_this).parent().removeClass("has-error").addClass("has-success");
          $(_this).popover("destroy");
        }else{
          $(_this).parent().addClass("has-error").removeClass("has-success");
          $(_this).data("toogle", "top").data("placement", "top").data("container", "body").data("content", $(_this).data("errmsg")).popover({"trigger":"manual"}).popover("show");
          return false;
        }
      }else{
        $(_this).parent().addClass("has-success");
      }
      return true;
    }
  });
  $.fn.extend({
    Vaild : function(){
      $(this).each(function(index, _this){
        $(_this).submit(function(){
          var checkResult = true;
          for(var i = 0 ; i < _this.length; i++ ){
            checkResult = $.Vaild(_this[i]) && checkResult;
          }
          return checkResult;
        });
        for(var i = 0 ; i < _this.length; i++ ){
          $(_this[i]).blur(function(){
            $.Vaild(this);
          });
        }
      });
    }
  });
})(jQuery);