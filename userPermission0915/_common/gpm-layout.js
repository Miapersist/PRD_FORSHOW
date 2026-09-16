/* ============================================================
   GPM 统一布局（侧栏 / 顶栏 / 标签条）
   页面契约：
     <body>
       <template id="page-body"> ...页面内容... </template>
       <script src="_common/gpm-layout.js"></script>
       <script>GpmLayout.init({activePage:'xxx', breadcrumb:[...], tabs:[...]})</script>
     </body>
   ============================================================ */
var GpmLayout = (function () {

  var DEFAULT_MENU = [
    { group: '工作台' },
    { label: '采购部数字运营看板' },
    { label: '分析报表' },
    { group: '系统管理' },
    { label: '账户权限', open: true, children: [
      { label: '用户权限', key: 'userAccess', page: '01_用户权限.html' },
      { label: '角色维护', key: 'roleMaintenance', page: '02_角色维护.html' },
      { label: '数据权限配置', key: 'dataAuthConfig', page: '03_数据权限配置.html' },
      { label: '字段权限配置', key: 'fieldPermission', page: '04_字段权限配置.html' },
      { label: '字段元数据维护', key: 'fieldMetadata', page: '05_字段元数据维护.html' },
      { label: '统一统筹页', key: 'unifiedScope', page: '06_统一统筹页.html' },
      { label: '功能维护' },
      { label: '菜单维护' }
    ]},
    { label: '基础设置', children: [
      { label: '字典管理' },
      { label: '数据权限配置(旧)' }
    ]},
    { group: '业务模块' },
    { label: '车型项目管理', key: 'carModelProject', page: '07_车型项目管理.html' },
    { label: '零件认领' },
    { label: '成本分析报表', key: 'costReport', page: '08_成本分析报表.html' },
    { label: '价格管理' },
    { label: '零件成本' }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function buildSidebar(activePage) {
    var sb = el('div', 'sidebar');
    sb.appendChild(el('div', 'sidebar-header',
      '<div class="logo">G</div><div class="sys-name">GPM 系统</div>'));
    var srch = el('div', 'sidebar-search');
    srch.innerHTML = '<input type="text" placeholder="请输入关键词搜索">';
    sb.appendChild(srch);

    DEFAULT_MENU.forEach(function (item) {
      if (item.group) { sb.appendChild(el('div', 'menu-group', item.group)); return; }
      var ul = el('ul', 'sidebar-menu');
      if (item.children && item.open) {
        ul.appendChild(el('li', '', '▾ ' + item.label));
        item.children.forEach(function (c) {
          var li = el('li', 'sub' + (c.key === activePage ? ' active' : ''), '<span class="dot"></span>' + c.label);
          if (c.page) { li.onclick = function () { location.href = c.page; }; li.style.cursor = 'pointer'; }
          ul.appendChild(li);
        });
      } else {
        var li = el('li', (item.key === activePage ? 'active' : ''), item.label);
        if (item.page) { li.onclick = function () { location.href = item.page; }; li.style.cursor = 'pointer'; }
        ul.appendChild(li);
      }
      sb.appendChild(ul);
    });
    return sb;
  }

  function buildTopbar(breadcrumb) {
    var tb = el('div', 'topbar');
    tb.appendChild(el('span', 'hamburger', '☰'));
    var bc = '<div class="breadcrumb">';
    (breadcrumb || ['首页']).forEach(function (b, i, arr) {
      if (i > 0) bc += '<span class="sep">/</span>';
      bc += i === arr.length - 1 ? '<span class="cur">' + b + '</span>' : '<span>' + b + '</span>';
    });
    bc += '</div>';
    var bcWrap = document.createElement('span');
    bcWrap.innerHTML = bc;
    tb.appendChild(bcWrap.firstChild);
    tb.appendChild(el('div', 'topbar-right',
      '<span class="lang">ZH</span>' +
      '<span class="avatar"><span class="circle">董</span><span>董海涛</span></span>'));
    return tb;
  }

  function buildTabBar(tabs, activeTab) {
    var bar = el('div', 'tab-bar');
    (tabs || []).forEach(function (t) {
      var item = el('div', 'tab-item' + (t.key === activeTab ? ' active' : ''),
        t.label + (t.closable !== false ? ' <span class="close">×</span>' : ''));
      item.onclick = function (e) {
        if (e.target.classList.contains('close')) { item.remove(); return; }
        if (t.page) location.href = t.page;
      };
      item.style.cursor = 'pointer';
      bar.appendChild(item);
    });
    return bar;
  }

  function init(cfg) {
    cfg = cfg || {};
    var tpl = document.getElementById('page-body');
    var content = tpl ? tpl.content : null;

    var wrap = el('div', 'wrap');
    wrap.appendChild(buildSidebar(cfg.activePage));

    var main = el('div', 'main');
    main.appendChild(buildTopbar(cfg.breadcrumb));
    if (cfg.tabs) main.appendChild(buildTabBar(cfg.tabs, cfg.activeTab));

    var host = el('div', 'page-host');
    host.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;';
    if (content) host.appendChild(content);
    main.appendChild(host);
    wrap.appendChild(main);

    document.body.appendChild(wrap);
    if (typeof cfg.onReady === 'function') cfg.onReady();
  }

  return { init: init };
})();
