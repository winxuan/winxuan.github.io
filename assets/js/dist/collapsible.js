document.addEventListener("DOMContentLoaded", function () {
    let coll = document.getElementsByClassName("collapsible-container");
    let maxLines = 5; // 设置折叠显示的行数 Maximum number of lines to display without collapsing

    for (let i = 0; i < coll.length; i++) {
      let trigger = coll[i].querySelector('.collapsible-trigger');
      let content = coll[i].querySelector('.collapsible-content');
      let codeLines = content.textContent.split('\n').length;
   
      /* codeLines=实际行的行数*2+一行换行空行，因为chirpy主题使用了<table>标签，里边包含两列，所以js会将1行代码视为2行。下边被注释掉的代码可以查看codeLines的真实值。codeLines=real_lines*2+1wrap_blank_line,because the chirpy theme uses <table> with 2 columns,which js reguard 1 line as 2 lines. The code section below can help you see the real value of codeLines.
      let tempcodeLines = content.textContent.split('\n').length;
      let lineCount = document.createElement('span');
      lineCount.textContent = ' (' + tempcodeLines + ' lines)';
      coll[i].appendChild(lineCount);
      */
   
      if (codeLines - 6 <= maxLines) { /*根据主题的实际情况将codeLines调整为实际行数 Adjust codeLines to real lines*/
        trigger.style.display = 'none';
      } else {
        trigger.addEventListener("click", function () { 
          // 切换按钮上的文字
          if (this.innerHTML.includes("展开")) {
            this.innerHTML = "收起";
          } else {
            this.innerHTML = "展开";
          }
          this.classList.toggle("active");
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      }
    }
  });