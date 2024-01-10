document.addEventListener("DOMContentLoaded", function () {
    let coll = document.getElementsByClassName("collapsible-container");
    let maxLines = 19; // 设置折叠显示的行数 Maximum number of lines to display without collapsing
    let defaultOpenLines = 30; // 默认展开的最大行数

    for (let i = 0; i < coll.length; i++) {
      let trigger = coll[i].querySelector('.collapsible-trigger');
      let content = coll[i].querySelector('.collapsible-content');
      let codeLines = (content.textContent.split('\n').length - 1) / 2; // 计算实际的代码行数
   
      console.log(codeLines)

      if (codeLines <= defaultOpenLines) {
        this.innerHTML = "收起";
        trigger.style.display = 'none'; // 隐藏触发器
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        trigger.addEventListener("click", function () { 
          // var triggerPosition = trigger.getBoundingClientRect().top; // 获取按钮当前位置
          // 切换按钮上的文字
          if (this.innerHTML.includes("展开")) {
            this.innerHTML = "收起";
          } else {
            this.innerHTML = "展开";
          }
          this.classList.toggle("active");
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
            // 滚动页面到 trigger 元素的位置
            content.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
          // setTimeout(() => {
          //   window.scrollBy(0, trigger.getBoundingClientRect().top - triggerPosition);
          // }, 500); // 在内容展开/收起动画完成后调整滚动位置
        });
      }
    }
  });