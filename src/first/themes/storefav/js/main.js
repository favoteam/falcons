(function(window, $, undefined) {
    var Log = window.Log = (window.Log || {});
    Log.info = function() {
        try {
            console.info.apply(console, arguments)
        } catch(e) {
            try {
                opera.postError.apply(opera, arguments)
            } catch(e) {
                alert(Array.prototype.join.call(arguments, " "))
            }
        }
    };
    Log.error = function() {
        try {
            console.error.apply(console, arguments)
        } catch(e) {
            try {
                opera.postError.apply(opera, arguments)
            } catch(e) {
                alert(Array.prototype.join.call(arguments, " "))
            }
        }
    };
    jQuery.ajaxSetup({
        cache: false
    });
    var jWei = window.jWei = (window.jWei || {}),
    document = window.document;
    jWei._init = function() {
        this.confirm = (function() {
            var html = ' <div class="noty-confirm-bar clearfix">' + '<span class="noty-confirm-text"></span>' + '<div class="noty-confirm-btn">' + '<button class="btn btn-primary" id="btn_ok" style="margin-right:5px"><i class="icon-ok icon-white"></i>纭畾</button>' + '<button class="btn btn-danger" id="btn_cancel"><i class="icon-remove icon-white"></i>鍙栨秷</button>' + "</div></div>",
            timer = 400,
            load = false,
            confirm = undefined,
            overlay = undefined;
            return function(setting) {
                overlay = jWei.Overlay.getInstance();
                if (!load) {
                    $(document.body).append(html);
                    confirm = $(".noty-confirm-bar");
                    confirm.find("#btn_ok").click(function() {
                        setting.ok();
                        overlay.hide();
                        confirm.slideUp(timer)
                    });
                    confirm.find("#btn_cancel").click(function() {
                        overlay.hide();
                        confirm.slideUp(timer)
                    });
                    load = true
                }
                confirm.find(".noty-confirm-text").html(setting.content);
                overlay.show();
                confirm.slideDown(timer)
            }
        })();
        this.popUp = (function() {
            var defaultSetting = {
                width: "400px",
                title: "",
                content: "",
                popUpId: "",
                ok: null,
                iframeSrc: "",
                height: "",
                animate: false
            },
            cacheDomArry = [],
            getByCache = function(domId) {
                var jq = undefined;
                for (var i = 0; i < cacheDomArry.length; i++) {
                    if (cacheDomArry[i][domId]) {
                        jq = cacheDomArry[i][domId];
                        break
                    }
                }
                if (!jq) {
                    jq = $("#" + domId).detach();
                    var obj = {};
                    obj[domId] = jq;
                    cacheDomArry.push(obj)
                }
                return jq
            };
            return function(config) {
                var that = this.popUp;
                $.extend(that, defaultSetting);
                $.extend(that, defaultSetting, config);
                var jq = undefined,
                jPopUp = jWei.PopupContainer.getInstance(),
                popBody = jPopUp.getBody();
                popBody.find(".popup-modal").find("iframe").size() > 0 ? popBody.find(".popup-modal").remove() : popBody.find(".popup-modal").detach();
                if (!that.iframeSrc) {
                    that.popUpId ? jq = getByCache(that.popUpId) : jq = '<div class="popup-modal">' + that.content + "</div>";
                    popBody.append(jq)
                } else {
                    var iframe = document.createElement("iframe");
                    iframe.frameBorder = 0;
                    iframe.scrolling = "no";
                    iframe.src = that.iframeSrc;
                    iframe.style.width = that.width;
                    that.width = parseInt(that.width) + 60 + "px";
                    iframe.style.height = that.height;
                    jq = '<div class="popup-modal"></div>';
                    $(jq).appendTo(popBody).empty().append(iframe)
                }
                if (that.ok) {
                    jPopUp.getOkBtn().show();
                    jPopUp.getOkBtn().data("ok", that.ok)
                } else {
                    jPopUp.getOkBtn().hide()
                }
                return jPopUp.setAnimate(that.animate).setTilte(that.title).setWidth(that.width).show()
            }
        })()
    };
    jWei.util = {
        isIE: function() {
            return $.browser.msie
        },
        stopPasswordOper: function() {
            $("input[type='password']").each(function() {
                $(this).bind("contextmenu copy paste cut",
                function() {
                    return false
                })
            })
        },
        stopFormOper: function(id) {
            $("#" + id).bind("contextmenu copy paste cut",
            function() {
                return false
            })
        },
        isPC: function() {
            if (navigator.userAgent.match(/Android/i)) {
                return false
            }
            if ((navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1) || (navigator.userAgent.indexOf("iPad") != -1)) {
                return false
            }
            return true
        },
        isMobile: function() {
            if ((navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1) || navigator.userAgent.match(/Android/i)) {
                return true
            }
            return false
        }
    };
    jWei.Overlay = (function() {
        var html = '<div class="noty-modal-mask"></div>',
        instantiated = false,
        init = function() {
            var overlay = $(html).appendTo(document.body);
            return {
                show: function() {
                    overlay.fadeIn();
                    return overlay
                },
                hide: function() {
                    overlay.fadeOut();
                    return overlay
                }
            }
        };
        return {
            getInstance: function() {
                if (!instantiated) {
                    instantiated = init()
                }
                return instantiated
            }
        }
    })();
    jWei.PopupContainer = (function() {
        var instantiated = false,
        html = '<div  class="popup"><div class="popup-title">' + '<button type="button" class="close btn-close">脳</button>' + '<h3 class="popup-title-content"></h3></div><div class="popup-body"></div>' + '<div class="popup-foot clearfix">' + '<button class="btn btn-close">鍏抽棴</button>' + '<button class="btn  btn-danger btn-ok"><i class="icon-ok  icon-white"></i>纭畾</button></div></div>',
        init = function() {
            $(document.body).append(html);
            var popUp = $(".popup"),
            overlay = jWei.Overlay.getInstance(),
            closePopUp = function() {
                this.isAnimate ? popUp.slideUp(200) : popUp.hide();
                overlay.hide()
            };
            popUp.find(".btn-close").each(function() {
                $(this).click(function() {
                    closePopUp.call(jWei.PopupContainer.getInstance())
                })
            });
            popUp.find(".btn-ok").click(function() {
                if (typeof $(this).data("ok") === "function") {
                    var result = $(this).data("ok")();
                    if (result === false) {
                        return
                    }
                }
                closePopUp.call(jWei.PopupContainer.getInstance())
            });
            return {
                isAnimate: false,
                setAnimate: function(animate) {
                    this.isAnimate = animate;
                    return this
                },
                close: function() {
                    closePopUp.call(this)
                },
                setTilte: function(content) {
                    popUp.find(".popup-title-content").html(content);
                    return this
                },
                setWidth: function(width) {
                    popUp.css("width", width);
                    return this
                },
                getBody: function() {
                    return popUp.find(".popup-body")
                },
                getFoot: function() {
                    return popUp.find(".popup-foot")
                },
                show: function() {
                    overlay.show();
                    popUp.find(".popup-modal").show();
                    this.calPosition();
                    popUp.show();
                    this.isAnimate ? this.animate() : "";
                    return this
                },
                calPosition: function() {
                    var clientWidth = document.body.clientWidth,
                    popUpWidth = popUp.outerWidth(),
                    left = (clientWidth - popUpWidth) / 2;
                    popUp.css("left", left)
                },
                animate: function() {
                    popUp.css("top", -500);
                    popUp.animate({
                        top: "+=550"
                    },
                    200)
                },
                getOkBtn: function() {
                    return popUp.find(".btn-ok")
                }
            }
        };
        return {
            getInstance: function() {
                if (!instantiated) {
                    instantiated = init()
                }
                return instantiated
            }
        }
    })();
    jWei.Datagrid = function(config) {
        var defaultSetting = {
            showCheck: false,
            limit: 10,
            start: 0,
            data: {
                currPage: 1
            },
            tabWidth: "800px",
            legendTitle: "鏌ヨ缁撴灉",
            isSearch: false,
            showCols: true,
            fieldset: false
        };
        $.extend(this, defaultSetting, config);
        this._init()
    };
    jWei.Datagrid.prototype = {
        dataList: undefined,
        totalCount: 0,
        isSearch: false,
        page: undefined,
        $tabWrap: undefined,
        chkWidth: 70,
        $thead: undefined,
        $tbody: undefined,
        _init: function() {
            if (this.colModels) {
                this._settingTabStyle();
                this._settingSelectAll();
                this._settingTabTh();
                if (this.showCols) {
                    this._settingTools()
                }
                this._getData(this.data)
            }
        },
        _settingTabStyle: function() {
            var renderTo = this.renderTo,
            fieldId = "jq_" + $.now(),
            theadId = "jq_" + $.now(),
            width = this.legendTitle.length * 20 + "px",
            thead = $("<thead id=" + theadId + "><tr></tr></thead>");
            renderTo.append(thead);
            this.$thead = $("#" + theadId);
            renderTo.addClass("table table-striped  table-hover");
            if (this.fieldset) {
                renderTo.wrap($("<fieldset id=" + fieldId + ' style="width:' + this.tabWidth + ';"><div class="tab-content table-responsive"></div></fieldset>'))
            } else {
                renderTo.wrap($('<div class="tab-content table-responsive"></div>'))
            }
            this.$tabWrap = $("#" + fieldId);
            this.$tabWrap.find(".tab-content").before('<legend style="width:' + width + ';">' + this.legendTitle + "</legend>")
        },
        _settingSelectAll: function() {
            var that = this;
            if (this.showCheck) {
                var th = $('<th width="' + this.chkWidth + 'px"><label class="tab-th-check"><input type="checkbox" id="selectAll_id"/>鍏ㄩ€?</label></th>');
                this.$thead.find("tr").append(th);
                th.find("#selectAll_id").click(function() {
                    var checked = $(this).prop("checked");
                    that.$tbody.find(".head-check").each(function() {
                        $(this).prop("checked", checked)
                    })
                })
            }
        },
        _settingTabTh: function() {
            var thead = this.$thead;
            $.each(this.colModels,
            function(i, item) {
                thead.find("tr").append('<th width="' + item.width + '" data-col="' + item.name + '">' + item.displayName + "</th>")
            })
        },
        _settingTools: function() {
            var toolsHtml = ['<div class="col-tools">', '<dt class="tool-col-show">', "</dt>", '<button class="btn btn-info tools-btn" id="tools_btn"><span class="glyphicon glyphicon-chevron-down"></span></button>', "</div>"].join(""),
            $tabWrap = this.$tabWrap,
            toolCol = $tabWrap.find(".tab-content").append(toolsHtml).find(".tool-col-show");
            $.each(this.colModels,
            function(i, item) {
                toolCol.append('<dl><dd><label><input type="checkbox" checked class="chk-item" value="' + item.name + '"/>' + item.displayName + "</label></dd></dl>")
            });
            $tabWrap.find(".tab-content").find("#tools_btn").unbind("click").click(function() {
                toolCol.is(":hidden") ? toolCol.show() : toolCol.hide()
            });
            $tabWrap.find(".tab-content").find(".chk-item").each(function() {
                $(this).click(function() {
                    var colName = $(this).val(),
                    checked = $(this).prop("checked");
                    $tabWrap.find(".tab-content").find("[data-col='" + colName + "']").each(function() {
                        checked ? $(this).show() : $(this).hide()
                    })
                })
            });
            toolCol.mouseleave(function() {
                $(this).fadeOut()
            })
        },
        _getData: function(data) {
            var grid = this,
            mask = new jWei.Mask(grid.renderTo.attr("id")).start();
            var jajax = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.url,
                data: data,
                async: false,
                dataType: "json",
                success: function(data) {
                    grid.dataList = data.obj.list;
                    grid.totalCount = data.obj.totalCount;
                    if (!grid.totalCount) {
                        grid._drawEmptyGrid();
                        mask.end();
                        return
                    }
                    grid._drawGrid();
                    if (grid.isSearch) {
                        grid.page ? grid.page.destroy() : "";
                        grid.page = new jWei.Page(1, grid.limit, grid.totalCount, grid.renderTo, grid);
                        grid.isSearch = false
                    } else { ! grid.page ? grid.page = new jWei.Page(1, grid.limit, grid.totalCount, grid.renderTo, grid) : ""
                    }
                    mask.end()
                },
                error: function(data) {
                    mask.end()
                }
            });
            setTimeout(function() {
                jajax.abort();
                mask.end()
            },
            4000)
        },
        _drawGrid: function() {
            var grid = this,
            tbodyId = "jq_" + $.now(),
            tbody = $("<tbody id=" + tbodyId + "></tbody>");
            grid._cleanGrid();
            tbody.appendTo(grid.renderTo);
            grid.$tbody = $("#" + tbodyId);
            $.each(grid.dataList,
            function(index, item) {
                var tr = $("<tr></tr>");
                if (grid.showCheck) {
                    var chkTd = $('<td><input class="head-check" value="' + item[grid.showCheck.chkValue] + '" name="' + grid.showCheck.chkName + "[" + index + ']" type="checkbox"/></td>');
                    tr.append(chkTd);
                    if (grid.showCheck.handler) {
                        grid.showCheck.handler(item[grid.showCheck.chkValue], item, chkTd, tr)
                    }
                }
                for (var i in grid.colModels) {
                    var tdVal = item;
                    if (grid.colModels[i].name) {
                        var express = grid.colModels[i].name.split("_");
                        for (var x = 0; x < express.length; x++) {
                            tdVal = tdVal[express[x]]
                        }
                    }
                    var td = $('<td data-col="' + grid.colModels[i].name + '"></td>'),
                    chk = grid.$tabWrap.find(".col-tools").find("input[value='" + grid.colModels[i].name + "']").prop("checked"); (chk !== undefined && !chk) ? td.hide() : "";
                    tr.append(td);
                    grid.colModels[i].ellipsis ? td.append('<div class="ellipsis" style="width:' + grid.colModels[i].width + '"  title="' + tdVal + '">' + tdVal + "</div>") : td.html(tdVal);
                    grid.colModels[i].handler ? grid.colModels[i].handler(tdVal, item, td, tr) : ""
                }
                grid.$tbody.append(tr)
            })
        },
        _drawEmptyGrid: function() {
            var grid = this,
            tbodyId = "jq_" + $.now(),
            tbody = $("<tbody id=" + tbodyId + "></tbody>");
            grid._cleanGrid();
            tbody.appendTo(grid.renderTo);
            grid.$tbody = $("#" + tbodyId);
            if (grid.page) {
                grid.page.destroy();
                grid.page = null
            }
            if (grid.$tbody) {
                grid.$tbody.appendTo(grid.renderTo)
            }
            if (!grid.totalCount) {
                var emptyData = '<tr><td colspan="100">鏆傛棤璁板綍</td></tr>';
                grid.$tbody.append(emptyData);
                return
            }
        },
        _cleanGrid: function() {
            if (this.$tbody) {
                this.$tbody.html("")
            }
        },
        _reload: function(data) {
            if (!data.currPage) {
                this.data = $.extend(this.data, {
                    currPage: 1
                })
            }
            this.renderTo.find("#selectAll_id").prop("checked", false);
            this.data = $.extend(this.data, data || {});
            this._getData(this.data);
            if (this.page) {
                this.page.currPage = this.data.currPage;
                this.page.setPage();
                this.page.resetElmStatus()
            }
        },
        reload: function() {
            this._getData(this.data);
            if (this.page) {
                this.page.currPage = this.data.currPage;
                this.page.setPage();
                this.page.resetElmStatus()
            }
        },
        search: function(formId) {
            var formData = $("#" + formId).serializeArray(),
            data = {};
            console.error(formData);
            $(formData).each(function() {
                data[this.name] = this.value
            });
            this.isSearch = true;
            this._reload(data)
        }
    };
    jWei.Page = function(currPage, pageSize, totalCount, renderTo, grid) {
        this.currPage = currPage;
        this.pageSize = pageSize;
        this.setPageNum(totalCount);
        this.renderTo = renderTo;
        this.grid = grid;
        this.initPage()
    };
    jWei.Page.prototype = {
        pageNum: undefined,
        pageSize: 10,
        setNextPage: function() {
            var page = this;
            this.ulElm.append(this.nextPageElm);
            this.nextPageElm.click(function() {
                if (!$(this).hasClass("disabled")) {
                    page.grid._reload({
                        currPage: page.currPage + 1
                    })
                }
                return false
            })
        },
        setPrevPage: function() {
            var page = this;
            this.ulElm.append(this.prevPageElm);
            this.prevPageElm.click(function() {
                if (!$(this).hasClass("disabled")) {
                    page.grid._reload({
                        currPage: page.currPage - 1
                    })
                }
                return false
            })
        },
        setFirstPage: function() {
            var page = this;
            this.ulElm.append(this.firstPageElm);
            this.firstPageElm.click(function() {
                if (!$(this).hasClass("disabled")) {
                    page.grid._reload({
                        currPage: 1
                    })
                }
                return false
            })
        },
        setLastPage: function() {
            var page = this;
            this.ulElm.append(this.lastPageElm);
            this.lastPageElm.click(function() {
                if (!$(this).hasClass("disabled")) {
                    var pageNum = page.getPageNum();
                    page.grid._reload({
                        currPage: pageNum
                    })
                }
                return false
            })
        },
        setAllPage: function() {
            this.ulElm.append(this.totalPageElm)
        },
        setPage: function() {
            var pageNum = this.getPageNum();
            var page = this;
            this.clearPage();
            if (pageNum) {
                for (var i = this.getStartPage(); i <= this.getEndPage(); i++) {
                    var liElm = null;
                    if (i == this.currPage) {
                        liElm = $('<li class="active pageno"><a>' + i + "</a></li>")
                    } else {
                        liElm = $('<li data-pageno="' + i + '" class="pageno"><a>' + i + "</a></li>");
                        liElm.click(handler)
                    }
                    this.nextPageElm.before(liElm)
                }
                if (pageNum == 1) {
                    this.setNextDisabled();
                    this.setLastDisabled()
                }
            }
            function handler() {
                var no = $(this).attr("data-pageno");
                var data = {
                    currPage: parseInt(no)
                };
                page.grid._reload(data);
                return false
            }
        },
        getStartPage: function() {
            var pageNum = this.getPageNum();
            var currPage = this.currPage;
            if (currPage < 7) {
                return 1
            } else {
                var endPage = currPage + 5;
                if (endPage > pageNum) {
                    var startPage = currPage - (5 + endPage - pageNum);
                    return startPage < 1 ? 1 : startPage
                }
                return currPage - 5 < 1 ? 1 : currPage - 5
            }
        },
        getEndPage: function() {
            var pageNum = this.getPageNum();
            var currPage = this.currPage;
            if (currPage < 7) {
                return pageNum > this.pageSize ? this.pageSize: pageNum
            } else {
                var endPage = currPage + 5;
                return pageNum > endPage ? endPage: pageNum
            }
        },
        clearPage: function() {
            this.ulElm.find("li").each(function() {
                if ($(this).hasClass("pageno")) {
                    $(this).remove()
                }
            })
        },
        getPageNum: function() {
            return this.pageNum
        },
        setPageNum: function(totalCount) {
            var num = Math.floor(totalCount / this.pageSize);
            this.pageNum = totalCount % this.pageSize == 0 ? num: num + 1
        },
        initPage: function() {
            this.pageDiv = $('<div class="pagination pagination-small" id="pager"></div>');
            this.ulElm = $('<ul class="pagination pagination-sm"></ul>');
            this.nextPageElm = $("<li><a>禄</a></li>");
            this.prevPageElm = $('<li class="disabled"><a>芦</a></li>');
            this.firstPageElm = $('<li class="disabled"><a>棣栭〉</a></li>');
            this.lastPageElm = $("<li><a>鏈〉</a></li>");
            this.totalPageElm = $('<li style="margin-top:3px;" class="disabled"><a>鍏?' + this.getPageNum() + "椤?</a></li>");
            this.drawPage()
        },
        drawPage: function() {
            this.renderTo.after(this.pageDiv);
            this.pageDiv.append(this.ulElm);
            this.setFirstPage();
            this.setPrevPage();
            this.setNextPage();
            this.setLastPage();
            this.setAllPage();
            this.setPage()
        },
        resetElmStatus: function() {
            this.setFirstDisabled();
            this.setPrevDisabled();
            this.setNextDisabled();
            this.setLastDisabled()
        },
        setFirstDisabled: function() {
            if (this.currPage == 1) {
                this.firstPageElm.addClass("disabled")
            } else {
                this.firstPageElm.removeClass("disabled")
            }
        },
        setLastDisabled: function() {
            if (this.currPage == this.getPageNum() || this.getPageNum() == 1) {
                this.lastPageElm.addClass("disabled")
            } else {
                this.lastPageElm.removeClass("disabled")
            }
        },
        setPrevDisabled: function() {
            if (this.currPage == 1) {
                this.prevPageElm.addClass("disabled")
            } else {
                this.prevPageElm.removeClass("disabled")
            }
        },
        setNextDisabled: function() {
            if (this.currPage == this.getPageNum() || this.getPageNum() == 1) {
                this.nextPageElm.addClass("disabled")
            } else {
                this.nextPageElm.removeClass("disabled")
            }
        },
        destroy: function() {
            this.pageDiv.remove()
        }
    };
    jWei.Mask = function(elm) {
        elm instanceof jQuery ? this.jElm = elm: this.jElm = $("#" + elm)
    };
    jWei.Mask.prototype = {
        loadingDiv: $("<div></div>"),
        overlayDiv: $("<div></div>"),
        position: {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        },
        start: function() {
            return this._setPosition()._setOverlayPosition()._setLoadingPosition()
        },
        end: function() {
            this.loadingDiv.remove();
            this.overlayDiv.remove();
            return this
        },
        _setOverlayPosition: function() {
            $(document.body).append(this.overlayDiv);
            this.overlayDiv.addClass("loading-overlay");
            this.overlayDiv.css("left", this.position.left + "px");
            this.overlayDiv.css("top", this.position.top + "px");
            this.overlayDiv.css("width", this.position.width + "px");
            this.overlayDiv.css("height", this.position.height + "px");
            return this
        },
        _setPosition: function() {
            var jElm = this.jElm;
            this.position.width = jElm.outerWidth();
            this.position.height = jElm.outerHeight();
            this.position.left = jElm.offset().left;
            this.position.top = jElm.offset().top;
            return this
        },
        _setLoadingPosition: function() {
            $(document.body).append(this.loadingDiv);
            this.loadingDiv.addClass("loading-indicator");
            var loadDivWid = this.loadingDiv.outerWidth();
            var loadDivHei = this.loadingDiv.outerHeight();
            var left = this.position.left + (this.position.width - loadDivWid) / 2;
            var top = this.position.top + (this.position.height - loadDivHei) / 2;
            this.loadingDiv.css("left", left);
            this.loadingDiv.css("top", top);
            return this
        }
    };
    jWei.Tips = {
        _init: function(jqSelector, options) {
            if (jqSelector) {
                var that = this;
                jqSelector.each(function() {
                    var $t = {
                        tipWrap: $('<div class="SD-tipbox"></div>'),
                        tipContent: $('<div class="cntBox"></div>'),
                        tipArrow: $('<div class="SD-tipbox-direction"><em>&#9670;</em><span>&#9670;</span></div>'),
                        tipClose: $('<a title="鍏抽棴" onclick="return false" class="close-ico" href="#">鍏抽棴</a>'),
                        options: {}
                    };
                    $.extend($t.options, that._defaultOptions, options);
                    if ($t.options.showArrow) {
                        $t.tipWrap.append($t.tipContent).append($t.tipArrow).appendTo(document.body).attr("id", "tip" + that._generalId());
                        $t.tipArrow.addClass("SD-tipbox-" + $t.options.position)
                    } else {
                        $t.tipWrap.append($t.tipContent).appendTo(document.body).attr("id", "tip" + that._generalId())
                    }
                    if ($t.options.content) {
                        $t.tipContent.html($t.options.content)
                    } else {
                        $t.tipContent.html($(this).data("tips"))
                    }
                    $(this).data("jtip", $t);
                    if ($t.options.show) {
                        that._show($(this))
                    }
                    if ($t.options.closeAble) {
                        $t.tipWrap.append($t.tipClose);
                        var _tipObj = $(this);
                        $t.tipClose.on("click",
                        function() {
                            that._hide(_tipObj);
                            _tipObj.unbind("mouseover")
                        });
                        $(this).one("mouseover",
                        function() {
                            that._show($(this))
                        })
                    } else {
                        $(this).bind("mouseover focus",
                        function() {
                            that._show($(this))
                        });
                        $(this).bind("mouseout blur",
                        function() {
                            that._hide($(this))
                        })
                    }
                })
            }
        },
        _generalId: function() {
            return $.now()
        },
        tip: function(jqSelector, options) {
            this._init(jqSelector, options)
        },
        error: function(message) {
            this._initTipDiv(message, "error")
        },
        warn: function(message) {
            this._initTipDiv(message, "warn")
        },
        success: function(message) {
            this._initTipDiv(message, "success")
        },
        _initTipDiv: function(message, type) {
            var id = this._tipHtml.lastId;
            if (id) {
                $("#" + id).remove()
            }
            var jTip = "";
            if ("error" === type) {
                jTip = $(this._tipHtml.error)
            } else {
                if ("warn" === type) {
                    jTip = $(this._tipHtml.warn)
                } else {
                    if ("success" === type) {
                        jTip = $(this._tipHtml.success)
                    }
                }
            }
            id = $.now() + "wTip";
            this._tipHtml.lastId = id;
            jTip.attr("id", id);
            jTip.appendTo(document.body);
            jTip.html(message);
            jTip.slideDown(400).delay(800).slideUp(400)
        },
        _show: function(jElm) {
            var width = jElm.outerWidth(),
            height = jElm.outerHeight(),
            left = jElm.offset().left,
            top = jElm.offset().top,
            $t = jElm.data("jtip"),
            position = $t.options.position,
            showArrow = $t.options.showArrow,
            tHeight = $t.tipWrap.outerHeight(),
            tWidth = $t.tipWrap.outerWidth();
            if (position == "top") {
                if (showArrow) {
                    $t.tipWrap.css("left", left + (width - tWidth) / 2 + "px");
                    $t.tipWrap.css("top", top - tHeight - 9 + "px")
                } else {
                    $t.tipWrap.css("left", left + (width - tWidth) / 2 + "px");
                    $t.tipWrap.css("top", top - tHeight + "px")
                }
            } else {
                if (position == "right") {
                    if (showArrow) {
                        $t.tipWrap.css("left", left + width + 9 + "px");
                        $t.tipWrap.css("top", top + (height - tHeight) / 2 + "px")
                    } else {
                        $t.tipWrap.css("left", left + width + "px");
                        $t.tipWrap.css("top", top + (height - tHeight) / 2 + "px")
                    }
                } else {
                    if (position == "bottom") {
                        if (showArrow) {
                            $t.tipWrap.css("left", left + (width - tWidth) / 2 + "px");
                            $t.tipWrap.css("top", top + height + 9 + "px")
                        } else {
                            $t.tipWrap.css("left", left + (width - tWidth) / 2 + "px");
                            $t.tipWrap.css("top", top + height + "px")
                        }
                    } else {
                        if (position == "left") {
                            if (showArrow) {
                                $t.tipWrap.css("left", left - tWidth - 9 + "px");
                                $t.tipWrap.css("top", top + (height - tHeight) / 2 + "px")
                            } else {
                                $t.tipWrap.css("left", left - tWidth + "px");
                                $t.tipWrap.css("top", top + (height - tHeight) / 2 + "px")
                            }
                        }
                    }
                }
            }
            $t.tipWrap.show()
        },
        _recalPostion: function() {},
        _hide: function(jElm) {
            var $t = jElm.data("jtip");
            $t.tipWrap.hide()
        },
        _defaultOptions: {
            position: "right",
            closeAble: false,
            show: false,
            content: "",
            showArrow: true
        },
        _tipHtml: {
            success: '<div class="tip-success"></div>',
            warn: '<div class="tip-warn"></div>',
            error: '<div class="tip-error"></div>',
            lastId: ""
        }
    };
    jWei._init()
})(window, jQuery); (function($) {
    $.fn.pager = function(options) {
        return this.each(function() {
            $(this).empty().append(renderpager(parseInt(options.pagenumber), parseInt(options.pagecount), options.buttonClickCallback, options.isShowGo, options.isShowPrev))
        })
    };
    function renderpager(pagenumber, pagecount, buttonClickCallback, isShowGo, isShowPrev) {
        var $pager = $('<ul class="pagination"></ul>');
        if (isShowPrev) {
            $pager.append(renderButton("涓婁竴椤?", pagenumber, pagecount, buttonClickCallback))
        }
        var startPoint = 1;
        var endPoint = 5;
        var thpoint = "<li class=''><a href='#'>...</a></li>";
        if (pagenumber > 2) {
            startPoint = pagenumber - 2;
            endPoint = pagenumber + 2
        }
        if (endPoint > pagecount) {
            startPoint = pagecount - 4;
            endPoint = pagecount;
            thpoint = ""
        }
        if (startPoint < 1) {
            startPoint = 1
        }
        for (var page = startPoint; page <= endPoint; page++) {
            var currentButton = $('<li><a href="#">' + (page) + "</a></li>");
            page == pagenumber ? currentButton.addClass("active") : currentButton.click(function() {
                buttonClickCallback($(this).children().html());
                $(this).addClass("active");
                return false
            });
            currentButton.appendTo($pager)
        }
        $pager.append(thpoint).append(renderButton("涓嬩竴椤?", pagenumber, pagecount, buttonClickCallback));
        if (isShowGo) {
            var strgoto = $("<li class=''><input type='' value='" + pagenumber + "' maxlength='6' id='gotoval' style='width:30px;height:16px;'/></li>");
            $pager.append(strgoto);
            $pager.append(changepage("go", pagecount, buttonClickCallback))
        }
        return $pager
    }
    function changepage(buttonLabel, pagecount, buttonClickCallback) {
        var $btngoto = $('<li><a href="#">' + buttonLabel + "</a></li>");
        $btngoto.click(function() {
            var gotoval = $("#gotoval").val();
            var patrn = /^[1-9]([0-9]{1,20})$/;
            if (!patrn.test(gotoval)) {
                alert("璇疯緭鍏ラ潪闆剁殑姝ｆ暣鏁帮紒")
            }
            var intval = parseInt(gotoval);
            if (intval > pagecount) {
                alert("鎮ㄨ緭鍏ョ殑椤甸潰瓒呰繃鎬婚〉鏁? " + pagecount);
                return
            }
            buttonClickCallback(intval)
        });
        return $btngoto
    }
    function renderButton(buttonLabel, pagenumber, pagecount, buttonClickCallback) {
        var $Button = $('<li class="next"><a href="#">' + buttonLabel + "</a></li>");
        var destPage = 1;
        switch (buttonLabel) {
        case "棣栭〉":
            destPage = 1;
            break;
        case "涓婁竴椤?":
            destPage = pagenumber - 1;
            break;
        case "涓嬩竴椤?":
            destPage = pagenumber + 1;
            break;
        case "鏈〉":
            destPage = pagecount;
            break
        }
        if (buttonLabel == "棣栭〉" || buttonLabel == "涓婁竴椤?") {
            pagenumber <= 1 ? $Button.addClass("disabled") : $Button.click(function() {
                buttonClickCallback(destPage);
                return false
            })
        } else {
            pagenumber >= pagecount ? $Button.addClass("disabled") : $Button.click(function() {
                buttonClickCallback(destPage);
                return false
            })
        }
        return $Button
    }
    $.fn.pager.defaults = {
        pagenumber: 1,
        pagecount: 1
    }
})(jQuery); (function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory)
    } else {
        factory(jQuery)
    }
} (function($) {
    var pluses = /\+/g;
    function encode(s) {
        return config.raw ? s: encodeURIComponent(s)
    }
    function decode(s) {
        return config.raw ? s: decodeURIComponent(s)
    }
    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value))
    }
    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
        }
        try {
            s = decodeURIComponent(s.replace(pluses, " "));
            return config.json ? JSON.parse(s) : s
        } catch(e) {}
    }
    function read(s, converter) {
        var value = config.raw ? s: parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value
    }
    var config = $.cookie = function(key, value, options) {
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({},
            config.defaults, options);
            if (typeof options.expires === "number") {
                var days = options.expires,
                t = options.expires = new Date();
                t.setDate(t.getDate() + days)
            }
            return (document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path: "", options.domain ? "; domain=" + options.domain: "", options.secure ? "; secure": ""].join(""))
        }
        var result = key ? undefined: {};
        var cookies = document.cookie ? document.cookie.split("; ") : [];
        for (var i = 0,
        l = cookies.length; i < l; i++) {
            var parts = cookies[i].split("=");
            var name = decode(parts.shift());
            var cookie = parts.join("=");
            if (key && key === name) {
                result = read(cookie, value);
                break
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie
            }
        }
        return result
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false
        }
        $.cookie(key, "", $.extend({},
        options, {
            expires: -1
        }));
        return ! $.cookie(key)
    }
}));
if ("undefined" == typeof jQuery) throw new Error("Bootstrap requires jQuery"); +
function(a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap"),
        b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var c in b) if (void 0 !== a.style[c]) return {
            end: b[c]
        }
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1,
        d = this;
        a(this).one(a.support.transition.end,
        function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b),
        this
    },
    a(function() {
        a.support.transition = b()
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = '[data-dismiss="alert"]',
    c = function(c) {
        a(c).on("click", b, this.close)
    };
    c.prototype.close = function(b) {
        function c() {
            f.trigger("closed.bs.alert").remove()
        }
        var d = a(this),
        e = d.attr("data-target");
        e || (e = d.attr("href"), e = e && e.replace(/.*(?=#[^\s]*$)/, ""));
        var f = a(e);
        b && b.preventDefault(),
        f.length || (f = d.hasClass("alert") ? d: d.parent()),
        f.trigger(b = a.Event("close.bs.alert")),
        b.isDefaultPrevented() || (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one(a.support.transition.end, c).emulateTransitionEnd(150) : c())
    };
    var d = a.fn.alert;
    a.fn.alert = function(b) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.alert");
            e || d.data("bs.alert", e = new c(this)),
            "string" == typeof b && e[b].call(d)
        })
    },
    a.fn.alert.Constructor = c,
    a.fn.alert.noConflict = function() {
        return a.fn.alert = d,
        this
    },
    a(document).on("click.bs.alert.data-api", b, c.prototype.close)
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(c, d) {
        this.$element = a(c),
        this.options = a.extend({},
        b.DEFAULTS, d)
    };
    b.DEFAULTS = {
        loadingText: "loading..."
    },
    b.prototype.setState = function(a) {
        var b = "disabled",
        c = this.$element,
        d = c.is("input") ? "val": "html",
        e = c.data();
        a += "Text",
        e.resetText || c.data("resetText", c[d]()),
        c[d](e[a] || this.options[a]),
        setTimeout(function() {
            "loadingText" == a ? c.addClass(b).attr(b, b) : c.removeClass(b).removeAttr(b)
        },
        0)
    },
    b.prototype.toggle = function() {
        var a = this.$element.closest('[data-toggle="buttons"]'),
        b = !0;
        if (a.length) {
            var c = this.$element.find("input");
            "radio" === c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? b = !1 : a.find(".active").removeClass("active")),
            b && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
        }
        b && this.$element.toggleClass("active")
    };
    var c = a.fn.button;
    a.fn.button = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.button"),
            f = "object" == typeof c && c;
            e || d.data("bs.button", e = new b(this, f)),
            "toggle" == c ? e.toggle() : c && e.setState(c)
        })
    },
    a.fn.button.Constructor = b,
    a.fn.button.noConflict = function() {
        return a.fn.button = c,
        this
    },
    a(document).on("click.bs.button.data-api", "[data-toggle^=button]",
    function(b) {
        var c = a(b.target);
        c.hasClass("btn") || (c = c.closest(".btn")),
        c.button("toggle"),
        b.preventDefault()
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(b, c) {
        this.$element = a(b),
        this.$indicators = this.$element.find(".carousel-indicators"),
        this.options = c,
        this.paused = this.sliding = this.interval = this.$active = this.$items = null,
        "hover" == this.options.pause && this.$element.on("mouseenter", a.proxy(this.pause, this)).on("mouseleave", a.proxy(this.cycle, this))
    };
    b.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0
    },
    b.prototype.cycle = function(b) {
        return b || (this.paused = !1),
        this.interval && clearInterval(this.interval),
        this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)),
        this
    },
    b.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"),
        this.$items = this.$active.parent().children(),
        this.$items.index(this.$active)
    },
    b.prototype.to = function(b) {
        var c = this,
        d = this.getActiveIndex();
        return b > this.$items.length - 1 || 0 > b ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel",
        function() {
            c.to(b)
        }) : d == b ? this.pause().cycle() : this.slide(b > d ? "next": "prev", a(this.$items[b]))
    },
    b.prototype.pause = function(b) {
        return b || (this.paused = !0),
        this.$element.find(".next, .prev").length && a.support.transition.end && (this.$element.trigger(a.support.transition.end), this.cycle(!0)),
        this.interval = clearInterval(this.interval),
        this
    },
    b.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    },
    b.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    },
    b.prototype.slide = function(b, c) {
        var d = this.$element.find(".item.active"),
        e = c || d[b](),
        f = this.interval,
        g = "next" == b ? "left": "right",
        h = "next" == b ? "first": "last",
        i = this;
        if (!e.length) {
            if (!this.options.wrap) return;
            e = this.$element.find(".item")[h]()
        }
        this.sliding = !0,
        f && this.pause();
        var j = a.Event("slide.bs.carousel", {
            relatedTarget: e[0],
            direction: g
        });
        if (!e.hasClass("active")) {
            if (this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid.bs.carousel",
            function() {
                var b = a(i.$indicators.children()[i.getActiveIndex()]);
                b && b.addClass("active")
            })), a.support.transition && this.$element.hasClass("slide")) {
                if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                e.addClass(b),
                e[0].offsetWidth,
                d.addClass(g),
                e.addClass(g),
                d.one(a.support.transition.end,
                function() {
                    e.removeClass([b, g].join(" ")).addClass("active"),
                    d.removeClass(["active", g].join(" ")),
                    i.sliding = !1,
                    setTimeout(function() {
                        i.$element.trigger("slid.bs.carousel")
                    },
                    0)
                }).emulateTransitionEnd(600)
            } else {
                if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                d.removeClass("active"),
                e.addClass("active"),
                this.sliding = !1,
                this.$element.trigger("slid.bs.carousel")
            }
            return f && this.cycle(),
            this
        }
    };
    var c = a.fn.carousel;
    a.fn.carousel = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.carousel"),
            f = a.extend({},
            b.DEFAULTS, d.data(), "object" == typeof c && c),
            g = "string" == typeof c ? c: f.slide;
            e || d.data("bs.carousel", e = new b(this, f)),
            "number" == typeof c ? e.to(c) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    },
    a.fn.carousel.Constructor = b,
    a.fn.carousel.noConflict = function() {
        return a.fn.carousel = c,
        this
    },
    a(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]",
    function(b) {
        var c, d = a(this),
        e = a(d.attr("data-target") || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "")),
        f = a.extend({},
        e.data(), d.data()),
        g = d.attr("data-slide-to");
        g && (f.interval = !1),
        e.carousel(f),
        (g = d.attr("data-slide-to")) && e.data("bs.carousel").to(g),
        b.preventDefault()
    }),
    a(window).on("load",
    function() {
        a('[data-ride="carousel"]').each(function() {
            var b = a(this);
            b.carousel(b.data())
        })
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(c, d) {
        this.$element = a(c),
        this.options = a.extend({},
        b.DEFAULTS, d),
        this.transitioning = null,
        this.options.parent && (this.$parent = a(this.options.parent)),
        this.options.toggle && this.toggle()
    };
    b.DEFAULTS = {
        toggle: !0
    },
    b.prototype.dimension = function() {
        var a = this.$element.hasClass("width");
        return a ? "width": "height"
    },
    b.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b = a.Event("show.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.$parent && this.$parent.find("> .panel > .in");
                if (c && c.length) {
                    var d = c.data("bs.collapse");
                    if (d && d.transitioning) return;
                    c.collapse("hide"),
                    d || c.data("bs.collapse", null)
                }
                var e = this.dimension();
                this.$element.removeClass("collapse").addClass("collapsing")[e](0),
                this.transitioning = 1;
                var f = function() {
                    this.$element.removeClass("collapsing").addClass("in")[e]("auto"),
                    this.transitioning = 0,
                    this.$element.trigger("shown.bs.collapse")
                };
                if (!a.support.transition) return f.call(this);
                var g = a.camelCase(["scroll", e].join("-"));
                this.$element.one(a.support.transition.end, a.proxy(f, this)).emulateTransitionEnd(350)[e](this.$element[0][g])
            }
        }
    },
    b.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight,
                this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),
                this.transitioning = 1;
                var d = function() {
                    this.transitioning = 0,
                    this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")
                };
                return a.support.transition ? (this.$element[c](0).one(a.support.transition.end, a.proxy(d, this)).emulateTransitionEnd(350), void 0) : d.call(this)
            }
        }
    },
    b.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide": "show"]()
    };
    var c = a.fn.collapse;
    a.fn.collapse = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.collapse"),
            f = a.extend({},
            b.DEFAULTS, d.data(), "object" == typeof c && c);
            e || d.data("bs.collapse", e = new b(this, f)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.collapse.Constructor = b,
    a.fn.collapse.noConflict = function() {
        return a.fn.collapse = c,
        this
    },
    a(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]",
    function(b) {
        var c, d = a(this),
        e = d.attr("data-target") || b.preventDefault() || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""),
        f = a(e),
        g = f.data("bs.collapse"),
        h = g ? "toggle": d.data(),
        i = d.attr("data-parent"),
        j = i && a(i);
        g && g.transitioning || (j && j.find('[data-toggle=collapse][data-parent="' + i + '"]').not(d).addClass("collapsed"), d[f.hasClass("in") ? "addClass": "removeClass"]("collapsed")),
        f.collapse(h)
    })
} (jQuery),
+
function(a) {
    "use strict";
    function b() {
        a(d).remove(),
        a(e).each(function(b) {
            var d = c(a(this));
            d.hasClass("open") && (d.trigger(b = a.Event("hide.bs.dropdown")), b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown"))
        })
    }
    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d: b.parent()
    }
    var d = ".dropdown-backdrop",
    e = "[data-toggle=dropdown]",
    f = function(b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    f.prototype.toggle = function(d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e),
            g = f.hasClass("open");
            if (b(), !g) {
                if ("ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b), f.trigger(d = a.Event("show.bs.dropdown")), d.isDefaultPrevented()) return;
                f.toggleClass("open").trigger("shown.bs.dropdown"),
                e.focus()
            }
            return ! 1
        }
    },
    f.prototype.keydown = function(b) {
        if (/(38|40|27)/.test(b.keyCode)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var f = c(d),
                g = f.hasClass("open");
                if (!g || g && 27 == b.keyCode) return 27 == b.which && f.find(e).focus(),
                d.click();
                var h = a("[role=menu] li:not(.divider):visible a", f);
                if (h.length) {
                    var i = h.index(h.filter(":focus"));
                    38 == b.keyCode && i > 0 && i--,
                    40 == b.keyCode && i < h.length - 1 && i++,
                    ~i || (i = 0),
                    h.eq(i).focus()
                }
            }
        }
    };
    var g = a.fn.dropdown;
    a.fn.dropdown = function(b) {
        return this.each(function() {
            var c = a(this),
            d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new f(this)),
            "string" == typeof b && d[b].call(c)
        })
    },
    a.fn.dropdown.Constructor = f,
    a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = g,
        this
    },
    a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form",
    function(a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", e, f.prototype.toggle).on("keydown.bs.dropdown.data-api", e + ", [role=menu]", f.prototype.keydown)
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(b, c) {
        this.options = c,
        this.$element = a(b),
        this.$backdrop = this.isShown = null,
        this.options.remote && this.$element.load(this.options.remote)
    };
    b.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    b.prototype.toggle = function(a) {
        return this[this.isShown ? "hide": "show"](a)
    },
    b.prototype.show = function(b) {
        var c = this,
        d = a.Event("show.bs.modal", {
            relatedTarget: b
        });
        this.$element.trigger(d),
        this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function() {
            var d = a.support.transition && c.$element.hasClass("fade");
            c.$element.parent().length || c.$element.appendTo(document.body),
            c.$element.show(),
            d && c.$element[0].offsetWidth,
            c.$element.addClass("in").attr("aria-hidden", !1),
            c.enforceFocus();
            var e = a.Event("shown.bs.modal", {
                relatedTarget: b
            });
            d ? c.$element.find(".modal-dialog").one(a.support.transition.end,
            function() {
                c.$element.focus().trigger(e)
            }).emulateTransitionEnd(300) : c.$element.focus().trigger(e)
        }))
    },
    b.prototype.hide = function(b) {
        b && b.preventDefault(),
        b = a.Event("hide.bs.modal"),
        this.$element.trigger(b),
        this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one(a.support.transition.end, a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    },
    b.prototype.enforceFocus = function() {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.focus()
        },
        this))
    },
    b.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function(a) {
            27 == a.which && this.hide()
        },
        this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    },
    b.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(),
        this.backdrop(function() {
            a.removeBackdrop(),
            a.$element.trigger("hidden.bs.modal")
        })
    },
    b.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(),
        this.$backdrop = null
    },
    b.prototype.backdrop = function(b) {
        var c = this.$element.hasClass("fade") ? "fade": "";
        if (this.isShown && this.options.backdrop) {
            var d = a.support.transition && c;
            if (this.$backdrop = a('<div class="modal-backdrop ' + c + '" />').appendTo(document.body), this.$element.on("click.dismiss.modal", a.proxy(function(a) {
                a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            },
            this)), d && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
            d ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()
        } else ! this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()) : b && b()
    };
    var c = a.fn.modal;
    a.fn.modal = function(c, d) {
        return this.each(function() {
            var e = a(this),
            f = e.data("bs.modal"),
            g = a.extend({},
            b.DEFAULTS, e.data(), "object" == typeof c && c);
            f || e.data("bs.modal", f = new b(this, g)),
            "string" == typeof c ? f[c](d) : g.show && f.show(d)
        })
    },
    a.fn.modal.Constructor = b,
    a.fn.modal.noConflict = function() {
        return a.fn.modal = c,
        this
    },
    a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]',
    function(b) {
        var c = a(this),
        d = c.attr("href"),
        e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")),
        f = e.data("modal") ? "toggle": a.extend({
            remote: !/#/.test(d) && d
        },
        e.data(), c.data());
        b.preventDefault(),
        e.modal(f, this).one("hide",
        function() {
            c.is(":visible") && c.focus()
        })
    }),
    a(document).on("show.bs.modal", ".modal",
    function() {
        a(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal",
    function() {
        a(document.body).removeClass("modal-open")
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(a, b) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null,
        this.init("tooltip", a, b)
    };
    b.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    },
    b.prototype.init = function(b, c, d) {
        this.enabled = !0,
        this.type = b,
        this.$element = a(c),
        this.options = this.getOptions(d);
        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
            var g = e[f];
            if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter": "focus",
                i = "hover" == g ? "mouseleave": "blur";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)),
                this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({},
        this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    },
    b.prototype.getDefaults = function() {
        return b.DEFAULTS
    },
    b.prototype.getOptions = function(b) {
        return b = a.extend({},
        this.getDefaults(), this.$element.data(), b),
        b.delay && "number" == typeof b.delay && (b.delay = {
            show: b.delay,
            hide: b.delay
        }),
        b
    },
    b.prototype.getDelegateOptions = function() {
        var b = {},
        c = this.getDefaults();
        return this._options && a.each(this._options,
        function(a, d) {
            c[a] != d && (b[a] = d)
        }),
        b
    },
    b.prototype.enter = function(b) {
        var c = b instanceof this.constructor ? b: a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(c.timeout),
        c.hoverState = "in",
        c.options.delay && c.options.delay.show ? (c.timeout = setTimeout(function() {
            "in" == c.hoverState && c.show()
        },
        c.options.delay.show), void 0) : c.show()
    },
    b.prototype.leave = function(b) {
        var c = b instanceof this.constructor ? b: a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(c.timeout),
        c.hoverState = "out",
        c.options.delay && c.options.delay.hide ? (c.timeout = setTimeout(function() {
            "out" == c.hoverState && c.hide()
        },
        c.options.delay.hide), void 0) : c.hide()
    },
    b.prototype.show = function() {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(b), b.isDefaultPrevented()) return;
            var c = this.tip();
            this.setContent(),
            this.options.animation && c.addClass("fade");
            var d = "function" == typeof this.options.placement ? this.options.placement.call(this, c[0], this.$element[0]) : this.options.placement,
            e = /\s?auto?\s?/i,
            f = e.test(d);
            f && (d = d.replace(e, "") || "top"),
            c.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(d),
            this.options.container ? c.appendTo(this.options.container) : c.insertAfter(this.$element);
            var g = this.getPosition(),
            h = c[0].offsetWidth,
            i = c[0].offsetHeight;
            if (f) {
                var j = this.$element.parent(),
                k = d,
                l = document.documentElement.scrollTop || document.body.scrollTop,
                m = "body" == this.options.container ? window.innerWidth: j.outerWidth(),
                n = "body" == this.options.container ? window.innerHeight: j.outerHeight(),
                o = "body" == this.options.container ? 0 : j.offset().left;
                d = "bottom" == d && g.top + g.height + i - l > n ? "top": "top" == d && g.top - l - i < 0 ? "bottom": "right" == d && g.right + h > m ? "left": "left" == d && g.left - h < o ? "right": d,
                c.removeClass(k).addClass(d)
            }
            var p = this.getCalculatedOffset(d, g, h, i);
            this.applyPlacement(p, d),
            this.$element.trigger("shown.bs." + this.type)
        }
    },
    b.prototype.applyPlacement = function(a, b) {
        var c, d = this.tip(),
        e = d[0].offsetWidth,
        f = d[0].offsetHeight,
        g = parseInt(d.css("margin-top"), 10),
        h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0),
        isNaN(h) && (h = 0),
        a.top = a.top + g,
        a.left = a.left + h,
        d.offset(a).addClass("in");
        var i = d[0].offsetWidth,
        j = d[0].offsetHeight;
        if ("top" == b && j != f && (c = !0, a.top = a.top + f - j), /bottom|top/.test(b)) {
            var k = 0;
            a.left < 0 && (k = -2 * a.left, a.left = 0, d.offset(a), i = d[0].offsetWidth, j = d[0].offsetHeight),
            this.replaceArrow(k - e + i, i, "left")
        } else this.replaceArrow(j - f, j, "top");
        c && d.offset(a)
    },
    b.prototype.replaceArrow = function(a, b, c) {
        this.arrow().css(c, a ? 50 * (1 - a / b) + "%": "")
    },
    b.prototype.setContent = function() {
        var a = this.tip(),
        b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html": "text"](b),
        a.removeClass("fade in top bottom left right")
    },
    b.prototype.hide = function() {
        function b() {
            "in" != c.hoverState && d.detach()
        }
        var c = this,
        d = this.tip(),
        e = a.Event("hide.bs." + this.type);
        return this.$element.trigger(e),
        e.isDefaultPrevented() ? void 0 : (d.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, b).emulateTransitionEnd(150) : b(), this.$element.trigger("hidden.bs." + this.type), this)
    },
    b.prototype.fixTitle = function() {
        var a = this.$element; (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    },
    b.prototype.hasContent = function() {
        return this.getTitle()
    },
    b.prototype.getPosition = function() {
        var b = this.$element[0];
        return a.extend({},
        "function" == typeof b.getBoundingClientRect ? b.getBoundingClientRect() : {
            width: b.offsetWidth,
            height: b.offsetHeight
        },
        this.$element.offset())
    },
    b.prototype.getCalculatedOffset = function(a, b, c, d) {
        return "bottom" == a ? {
            top: b.top + b.height,
            left: b.left + b.width / 2 - c / 2
        }: "top" == a ? {
            top: b.top - d,
            left: b.left + b.width / 2 - c / 2
        }: "left" == a ? {
            top: b.top + b.height / 2 - d / 2,
            left: b.left - c
        }: {
            top: b.top + b.height / 2 - d / 2,
            left: b.left + b.width
        }
    },
    b.prototype.getTitle = function() {
        var a, b = this.$element,
        c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    },
    b.prototype.tip = function() {
        return this.$tip = this.$tip || a(this.options.template)
    },
    b.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    },
    b.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    },
    b.prototype.enable = function() {
        this.enabled = !0
    },
    b.prototype.disable = function() {
        this.enabled = !1
    },
    b.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    },
    b.prototype.toggle = function(b) {
        var c = b ? a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;
        c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    },
    b.prototype.destroy = function() {
        this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    var c = a.fn.tooltip;
    a.fn.tooltip = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.tooltip"),
            f = "object" == typeof c && c;
            e || d.data("bs.tooltip", e = new b(this, f)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.tooltip.Constructor = b,
    a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = c,
        this
    }
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
    b.DEFAULTS = a.extend({},
    a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }),
    b.prototype = a.extend({},
    a.fn.tooltip.Constructor.prototype),
    b.prototype.constructor = b,
    b.prototype.getDefaults = function() {
        return b.DEFAULTS
    },
    b.prototype.setContent = function() {
        var a = this.tip(),
        b = this.getTitle(),
        c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html": "text"](b),
        a.find(".popover-content")[this.options.html ? "html": "text"](c),
        a.removeClass("fade top bottom left right in"),
        a.find(".popover-title").html() || a.find(".popover-title").hide()
    },
    b.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    },
    b.prototype.getContent = function() {
        var a = this.$element,
        b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    },
    b.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    },
    b.prototype.tip = function() {
        return this.$tip || (this.$tip = a(this.options.template)),
        this.$tip
    };
    var c = a.fn.popover;
    a.fn.popover = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.popover"),
            f = "object" == typeof c && c;
            e || d.data("bs.popover", e = new b(this, f)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.popover.Constructor = b,
    a.fn.popover.noConflict = function() {
        return a.fn.popover = c,
        this
    }
} (jQuery),
+
function(a) {
    "use strict";
    function b(c, d) {
        var e, f = a.proxy(this.process, this);
        this.$element = a(c).is("body") ? a(window) : a(c),
        this.$body = a("body"),
        this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", f),
        this.options = a.extend({},
        b.DEFAULTS, d),
        this.selector = (this.options.target || (e = a(c).attr("href")) && e.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a",
        this.offsets = a([]),
        this.targets = a([]),
        this.activeTarget = null,
        this.refresh(),
        this.process()
    }
    b.DEFAULTS = {
        offset: 10
    },
    b.prototype.refresh = function() {
        var b = this.$element[0] == window ? "offset": "position";
        this.offsets = a([]),
        this.targets = a([]);
        var c = this;
        this.$body.find(this.selector).map(function() {
            var d = a(this),
            e = d.data("target") || d.attr("href"),
            f = /^#\w/.test(e) && a(e);
            return f && f.length && [[f[b]().top + (!a.isWindow(c.$scrollElement.get(0)) && c.$scrollElement.scrollTop()), e]] || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            c.offsets.push(this[0]),
            c.targets.push(this[1])
        })
    },
    b.prototype.process = function() {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset,
        c = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
        d = c - this.$scrollElement.height(),
        e = this.offsets,
        f = this.targets,
        g = this.activeTarget;
        if (b >= d) return g != (a = f.last()[0]) && this.activate(a);
        for (a = e.length; a--;) g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
    },
    b.prototype.activate = function(b) {
        this.activeTarget = b,
        a(this.selector).parents(".active").removeClass("active");
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
        d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")),
        d.trigger("activate.bs.scrollspy")
    };
    var c = a.fn.scrollspy;
    a.fn.scrollspy = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.scrollspy"),
            f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.scrollspy.Constructor = b,
    a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = c,
        this
    },
    a(window).on("load",
    function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            b.scrollspy(b.data())
        })
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(b) {
        this.element = a(b)
    };
    b.prototype.show = function() {
        var b = this.element,
        c = b.closest("ul:not(.dropdown-menu)"),
        d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a")[0],
            f = a.Event("show.bs.tab", {
                relatedTarget: e
            });
            if (b.trigger(f), !f.isDefaultPrevented()) {
                var g = a(d);
                this.activate(b.parent("li"), c),
                this.activate(g, g.parent(),
                function() {
                    b.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: e
                    })
                })
            }
        }
    },
    b.prototype.activate = function(b, c, d) {
        function e() {
            f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),
            b.addClass("active"),
            g ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"),
            b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"),
            d && d()
        }
        var f = c.find("> .active"),
        g = d && a.support.transition && f.hasClass("fade");
        g ? f.one(a.support.transition.end, e).emulateTransitionEnd(150) : e(),
        f.removeClass("in")
    };
    var c = a.fn.tab;
    a.fn.tab = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.tab");
            e || d.data("bs.tab", e = new b(this)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.tab.Constructor = b,
    a.fn.tab.noConflict = function() {
        return a.fn.tab = c,
        this
    },
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]',
    function(b) {
        b.preventDefault(),
        a(this).tab("show")
    })
} (jQuery),
+
function(a) {
    "use strict";
    var b = function(c, d) {
        this.options = a.extend({},
        b.DEFAULTS, d),
        this.$window = a(window).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)),
        this.$element = a(c),
        this.affixed = this.unpin = null,
        this.checkPosition()
    };
    b.RESET = "affix affix-top affix-bottom",
    b.DEFAULTS = {
        offset: 0
    },
    b.prototype.checkPositionWithEventLoop = function() {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    },
    b.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var c = a(document).height(),
            d = this.$window.scrollTop(),
            e = this.$element.offset(),
            f = this.options.offset,
            g = f.top,
            h = f.bottom;
            "object" != typeof f && (h = g = f),
            "function" == typeof g && (g = f.top()),
            "function" == typeof h && (h = f.bottom());
            var i = null != this.unpin && d + this.unpin <= e.top ? !1 : null != h && e.top + this.$element.height() >= c - h ? "bottom": null != g && g >= d ? "top": !1;
            this.affixed !== i && (this.unpin && this.$element.css("top", ""), this.affixed = i, this.unpin = "bottom" == i ? e.top - d: null, this.$element.removeClass(b.RESET).addClass("affix" + (i ? "-" + i: "")), "bottom" == i && this.$element.offset({
                top: document.body.offsetHeight - h - this.$element.height()
            }))
        }
    };
    var c = a.fn.affix;
    a.fn.affix = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("bs.affix"),
            f = "object" == typeof c && c;
            e || d.data("bs.affix", e = new b(this, f)),
            "string" == typeof c && e[c]()
        })
    },
    a.fn.affix.Constructor = b,
    a.fn.affix.noConflict = function() {
        return a.fn.affix = c,
        this
    },
    a(window).on("load",
    function() {
        a('[data-spy="affix"]').each(function() {
            var b = a(this),
            c = b.data();
            c.offset = c.offset || {},
            c.offsetBottom && (c.offset.bottom = c.offsetBottom),
            c.offsetTop && (c.offset.top = c.offsetTop),
            b.affix(c)
        })
    })
} (jQuery); (function(a) {
    a.fn.scrollLoading = function(b) {
        var c = {
            attr: "data-url",
            container: a(window),
            callback: a.noop
        };
        var d = a.extend({},
        c, b || {});
        d.cache = [];
        a(this).each(function() {
            var h = this.nodeName.toLowerCase(),
            g = a(this).attr(d.attr);
            var i = {
                obj: a(this),
                tag: h,
                url: g
            };
            d.cache.push(i)
        });
        var f = function(g) {
            if (a.isFunction(d.callback)) {
                d.callback.call(g.get(0))
            }
        };
        var e = function() {
            var g = d.container.height();
            if (a(window).get(0) === window) {
                contop = a(window).scrollTop()
            } else {
                contop = d.container.offset().top
            }
            a.each(d.cache,
            function(m, n) {
                var p = n.obj,
                j = n.tag,
                k = n.url,
                l, h;
                if (p) {
                    l = p.offset().top - contop,
                    l + p.height();
                    if ((l >= 0 && l < g) || (h > 0 && h <= g)) {
                        if (k) {
                            if (j === "img") {
                                f(p.attr("src", k))
                            } else {
                                p.load(k, {},
                                function() {
                                    f(p)
                                })
                            }
                        } else {
                            f(p)
                        }
                        n.obj = null
                    }
                }
            })
        };
        e();
        d.container.bind("scroll", e)
    }
})(jQuery); (function($) {
    var jValidation = window.jValidation = (window.jValidation || {});
    jValidation.ajax = {
        Result: function() {}
    };
    jValidation.ajax.Result.prototype = {
        result: undefined,
        errorMsg: undefined,
        errorCode: undefined,
        setErrorMsg: function(errorMsg) {
            this.errorMsg = errorMsg
        },
        setErrorCode: function(errorCode) {
            this.errorCode = errorCode
        },
        setResult: function(result) {
            this.result = result
        }
    };
    jValidation.ValidationDefaultOptions = function() {};
    jValidation.ValidationDefaultOptions.prototype = {
        onSubmit: true,
        onReset: true,
        stopOnFirst: false,
        immediate: false,
        focusOnError: false,
        useTitles: false,
        onFormValidate: function(result, form) {
            return result
        },
        onElementValidate: function(result, elm) {},
        onElementValidateForAjax: function(elm) {}
    };
    jValidation.Tips = {
        useTips: false,
        showArrow: true,
        position: "right"
    };
    jValidation.ValidatorDefaultOptions = function() {};
    jValidation.ValidatorDefaultOptions.prototype = {
        ignoreEmptyValue: true,
        depends: []
    };
    jValidation.util = {
        rclass: /[\n\t]/g,
        hasClass: function(dom, className) {
            var className = " " + className + " ";
            return dom.className && ((" " + dom.className + " ").replace(this.rclass, " ").indexOf(className) > -1)
        },
        stop: function(event) {
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation()
            } else {
                event.returnValue = false;
                event.cancelBubble = true
            }
        },
        getElementLeft: function(element) {
            var actualLeft = element.offsetLeft;
            var current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent
            }
            return actualLeft
        },
        getElementTop: function(element) {
            var actualTop = element.offsetTop;
            var current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent
            }
            return actualTop
        },
        toArrayByArgus: function(arguments) {
            return Array.prototype.slice.call(arguments)
        },
        visible: function(element) {
            return $(element).css("display") != "none"
        },
        isVisible: function(elm) {
            while (elm && elm.tagName != "BODY") {
                if (!this.visible(elm)) {
                    return false
                }
                elm = elm.parentNode
            }
            return true
        },
        getInputValue: function(elm) {
            var jElm = $(elm);
            return jElm.val()
        },
        getArgumentsByClassName: function(prefix, className) {
            if (!className || !prefix) {
                return []
            }
            var pattern = new RegExp(prefix + "-(\\S+)");
            var matchs = className.match(pattern);
            if (!matchs) {
                return []
            }
            var results = [];
            results.singleArgument = matchs[1];
            var args = matchs[1].split("-");
            for (var i = 0; i < args.length; i++) {
                if (args[i] == "") {
                    if (i + 1 < args.length) {
                        args[i + 1] = "-" + args[i + 1]
                    }
                } else {
                    results.push(args[i])
                }
            }
            return results
        },
        getFormElements: function(formId) {
            var jForm = $("#" + formId);
            return jForm.find(":text,:password,:radio,:checkbox,select,textarea")
        },
        format: function(str, args) {
            args = args || [];
            jValidation.util.assert(args.constructor == Array, "jValidation.util.format() arguement 'args' must is Array");
            var result = str;
            for (var i = 0; i < args.length; i++) {
                result = result.replace(/%s/, args[i])
            }
            return result
        },
        assert: function(condition, message) {
            var errorMessage = message || ("assert failed error,condition=" + condition);
            if (!condition) {
                alert(errorMessage);
                throw new Error(errorMessage)
            } else {
                return condition
            }
        },
        getElmID: function(elm) {
            return $(elm).attr("id") ? $(elm).attr("id") : $(elm).attr("name")
        },
        getLanguage: function() {
            var lang = null;
            if (typeof navigator.userLanguage == "undefined") {
                lang = navigator.language.toLowerCase()
            } else {
                lang = navigator.userLanguage.toLowerCase()
            }
            return lang
        },
        getMessageSource: function() {
            var lang = jValidation.util.getLanguage();
            var messageSource = jValidation.Validator.messageSource["zh-cn"];
            if (jValidation.Validator.messageSource[lang]) {
                messageSource = jValidation.Validator.messageSource[lang]
            }
            var results = {};
            for (var i = 0; i < messageSource.length; i++) {
                results[messageSource[i][0]] = messageSource[i][1]
            }
            return results
        },
        getI18nMsg: function(key) {
            return jValidation.util.getMessageSource()[key]
        }
    };
    jValidation.Validator = function(className, test, options) {
        this.init(className, test, options)
    };
    jValidation.Validator.messageSource = {};
    jValidation.Validator.messageSource["en-us"] = [["validation-failed", "Validation failed."], ["required", "This is a required field."], ["validate-number", "Please enter a valid number in this field."], ["validate-digits", "Please use numbers only in this field. please avoid spaces or other characters such as dots or commas."], ["validate-alpha", "Please use letters only (a-z) in this field."], ["validate-alphanum", "Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed."], ["validate-email", "Please enter a valid email address. For example fred@domain.com ."], ["validate-url", "Please enter a valid URL."], ["validate-currency-dollar", "Please enter a valid $ amount. For example $100.00 ."], ["validate-one-required", "Please select one of the above options."], ["validate-integer", "Please enter a valid integer in this field"], ["validate-pattern", "Validation failed."], ["validate-ip", "Please enter a valid IP address"], ["min-value", "min value is %s."], ["max-value", "max value is %s."], ["min-length", "min length is %s,current length is %s."], ["max-length", "max length is %s,current length is %s."], ["int-range", "Please enter integer value between %s and %s"], ["float-range", "Please enter number between %s and %s"], ["length-range", "Please enter value length between %s and %s,current length is %s"], ["equals", "Conflicting with above value."], ["less-than", "Input value must be less than above value."], ["less-than-equal", "Input value must be less than or equal above value."], ["great-than", "Input value must be great than above value."], ["great-than-equal", "Input value must be great than or equal above value."], ["validate-date", "Please use this date format: %s. For example %s."], ["validate-selection", "Please make a selection."], ["validate-file",
    function(v, elm, args, metadata) {
        return jValidationUtil.util.format("Please enter file type in [%s]", [args.join(",")])
    }], ["validate-id-number", "Please enter a valid id number."], ["validate-chinese", "Please enter chinese"], ["validate-phone", "Please enter a valid phone number,current length is %s."], ["validate-mobile-phone", "Please enter a valid mobile phone,For example 13910001000.current length is %s."], ["validate-zip", "Please enter a valid zip code."], ["validate-qq", "Please enter a valid qq number"], ["validate-devid", "The device ID is wrong"], ["validate-space", "Not input space"], ["checkbox-required", "Please checked checkbox"]];
    jValidation.Validator.messageSource["en"] = jValidation.Validator.messageSource["en-us"];
    jValidation.Validator.messageSource["zh-cn"] = [["validation-failed", "楠岃瘉澶辫触."], ["required", "蹇呭～椤癸紒"], ["validate-number", "璇疯緭鍏ユ湁鏁堢殑鏁板瓧."], ["validate-digits", "璇疯緭鍏ユ暟瀛?."], ["validate-alpha", "璇疯緭鍏ヨ嫳鏂囧瓧姣?."], ["validate-alphanum", "璇疯緭鍏ヨ嫳鏂囧瓧姣嶆垨鏄暟瀛?,鍏跺畠瀛楃鏄笉鍏佽鐨?."], ["validate-email", "璇疯緭鍏ユ湁鏁堢殑閭欢鍦板潃,濡? username@example.com."], ["validate-url", "璇疯緭鍏ユ湁鏁堢殑URL鍦板潃."], ["validate-currency-dollar", "Please enter a valid $ amount. For example $100.00 ."], ["validate-one-required", "鍦ㄥ墠闈㈤€夐」鑷冲皯閫夋嫨涓€涓?."], ["validate-integer", "璇疯緭鍏ユ纭殑鏁存暟"], ["validate-pattern", "杈撳叆鐨勫€间笉鍖归厤"], ["validate-ip", "璇疯緭鍏ユ纭殑IP鍦板潃"], ["min-value", "鏈€灏忓€间负%s"], ["max-value", "鏈€澶у€间负%s"], ["min-length", "鏈€灏忛暱搴︿负%s,褰撳墠闀垮害涓?%s."], ["max-length", "鏈€澶ч暱搴︿负%s,褰撳墠闀垮害涓?%s."], ["int-range", "杈撳叆鍊煎簲璇ヤ负 %s 鑷? %s 鐨勬暣鏁?"], ["float-range", "杈撳叆鍊煎簲璇ヤ负 %s 鑷? %s 鐨勬暟瀛?"], ["length-range", "杈撳叆鍊肩殑闀垮害搴旇鍦? %s 鑷? %s 涔嬮棿,褰撳墠闀垮害涓?%s"], ["equals", "涓ゆ杈撳叆涓嶄竴鑷?,璇烽噸鏂拌緭鍏?"], ["less-than", "璇疯緭鍏ュ皬浜庡墠闈㈢殑鍊?"], ["less-than-equal", "璇疯緭鍏ュ皬浜庢垨绛変簬鍓嶉潰鐨勫€?"], ["great-than", "璇疯緭鍏ュぇ浜庡墠闈㈢殑鍊?"], ["great-than-equal", "璇疯緭鍏ュぇ浜庢垨绛変簬鍓嶉潰鐨勫€?"], ["validate-date", "璇疯緭鍏ユ湁鏁堢殑鏃ユ湡,鏍煎紡涓? %s. 渚嬪:%s."], ["validate-selection", "璇烽€夋嫨."], ["validate-file",
    function(v, elm, args, metadata) {
        return jValidation.util.format("鏂囦欢绫诲瀷搴旇涓篬%s]鍏朵腑涔嬩竴", [args.join(",")])
    }], ["validate-id-number", "璇疯緭鍏ュ悎娉曠殑韬唤璇佸彿鐮?"], ["validate-chinese", "璇疯緭鍏ヤ腑鏂?"], ["validate-phone", "璇疯緭鍏ユ纭殑鐢佃瘽鍙风爜,濡?:010-29392929,褰撳墠闀垮害涓?%s."], ["validate-mobile-phone", "璇疯緭鍏ユ纭殑鎵嬫満鍙风爜,褰撳墠闀垮害涓?%s."], ["validate-zip", "璇疯緭鍏ユ湁鏁堢殑閭斂缂栫爜"], ["validate-qq", "璇疯緭鍏ユ湁鏁堢殑QQ鍙风爜."], ["validate-devid", "璁惧杈撳叆ID鏈夎"], ["validate-space", "涓嶈兘杈撳叆绌烘牸"], ["checkbox-required", "璇ュ閫夋蹇呴』閫変腑"]];
    jValidation.Validator.prototype = {
        init: function(className, test, options) {
            this.options = $.extend(new jValidation.ValidatorDefaultOptions(), options || {});
            this._test = test ? test: function(v, elm) {
                return true
            };
            this._error = jValidation.util.getI18nMsg(className) ? jValidation.util.getI18nMsg(className) : jValidation.util.getI18nMsg("validation-failed");
            this.className = className
        },
        _dependsTest: function(v, elm) {
            if (this.options.depends && this.options.depends.length > 0) {
                var dependsResult = $A(this.options.depends).all(function(depend) {
                    return jValidation.Validation.get(depend).test(v, elm)
                });
                return dependsResult
            }
            return true
        },
        testAndGetError: function(v, elm, useTitle) {
            var dependsError = this.testAndGetDependsError(v, elm);
            if (dependsError) {
                return dependsError
            }
            if (!elm) {
                elm = {}
            }
            var isEmpty = (this.options.ignoreEmptyValue && ((v == null) || (v.length == 0)));
            var result = isEmpty || this._test(v, elm, jValidation.util.getArgumentsByClassName(this.className, elm.className), this);
            if (!result) {
                return this.error(v, elm, useTitle)
            }
            return null
        },
        testAndGetDependsError: function(v, elm) {
            var depends = this.options.depends;
            if (depends && depends.length > 0) {
                for (var i = 0; i < depends.length; i++) {
                    var dependsError = jValidation.Validation.get(depends[i]).testAndGetError(v, elm);
                    if (dependsError) {
                        return dependsError
                    }
                }
            }
            return null
        },
        error: function(v, elm, useTitle) {
            var args = jValidation.util.getArgumentsByClassName(this.className, elm.className);
            var error = this._error;
            if (typeof error == "string") {
                if (v) {
                    args.push(v.length)
                }
                error = jValidation.util.format(this._error, args)
            } else {
                if (typeof error == "function") {
                    error = error(v, elm, args, this)
                } else {
                    alert('property "_error" must type of string or function,current type:' + typeof error + " current className:" + this.className)
                }
            }
            useTitle = jValidation.util.hasClass(elm, "useTitle");
            if (useTitle) {
                if (elm) {
                    var titleName = this.className + "-title";
                    if (elm.getAttribute(titleName)) {
                        var titleErrorMsg = elm.getAttribute(titleName);
                        return titleErrorMsg
                    }
                }
            }
            return error
        }
    };
    jValidation.Validation = function(formId, options) {
        this.init(formId, options);
        return this
    };
    jValidation.Validation.prototype = {
        init: function(formId, options) {
            this.options = $.extend(true, new jValidation.ValidationDefaultOptions(), options);
            this.formId = formId;
            if (this.options.immediate) {
                var useTitles = this.options.useTitles;
                var callback = this.options.onElementValidate;
                var ajaxCallback = this.options.onElementValidateForAjax;
                var elements = jValidation.util.getFormElements(formId);
                elements.each(function() {
                    $(this).bind("blur",
                    function(event) {
                        jValidation.Validation.validateElement(event.target || event.srcElement, {
                            useTitle: useTitles,
                            onElementValidate: callback,
                            onElementValidateForAjax: ajaxCallback
                        })
                    });
                    if ($(this).prop("tagName").toLowerCase() == "select") {
                        $(this).bind("change",
                        function(event) {
                            jValidation.Validation.reset(event.target || event.srcElement)
                        })
                    } else {
                        if (this.type.toLowerCase() == "checkbox") {
                            $(this).bind("click",
                            function(event) {
                                jValidation.Validation.resetCheckbox(event.target || event.srcElement)
                            })
                        } else {
                            $(this).bind("keydown",
                            function(event) {
                                jValidation.Validation.reset(event.target || event.srcElement)
                            })
                        }
                    }
                })
            }
        },
        onSubmit: function(ev) {
            if (!this.validate()) {
                jValidation.util.stop(ev)
            }
        },
        validate: function() {
            var result = true;
            var useTitles = this.options.useTitles;
            var callback = this.options.onElementValidate;
            var ajaxCallback = this.options.onElementValidateForAjax;
            var jElements = jValidation.util.getFormElements(this.formId);
            if (this.options.stopOnFirst) {
                for (var i = 0; i < jElements.size(); i++) {
                    var elm = jElements[i];
                    result = jValidation.Validation.validateElement(elm, {
                        useTitle: useTitles,
                        onElementValidate: callback,
                        onElementValidateForAjax: ajaxCallback
                    });
                    if (!result) {
                        break
                    }
                }
            } else {
                for (var i = 0; i < jElements.size(); i++) {
                    var elm = jElements[i];
                    if (!jValidation.Validation.validateElement(elm, {
                        useTitle: useTitles,
                        onElementValidate: callback,
                        onElementValidateForAjax: ajaxCallback
                    })) {
                        result = false
                    }
                }
            }
            if (!result && this.options.focusOnError) {
                var first = null;
                jElements.each(function() {
                    if (jValidation.util.hasClass(this, "validation-failed")) {
                        first = this;
                        return false
                    }
                });
                if (first.select) {
                    first.select()
                }
                first.focus()
            }
            return this.options.onFormValidate(result, this.formId)
        },
        reset: function() {
            var jElements = jValidation.util.getFormElements(this.formId);
            jElements.each(function() {
                jValidation.Validation.reset(this)
            })
        }
    };
    $.extend(true, jValidation.Validation, {
        validateElement: function(elm, options) {
            options = $.extend({
                useTitle: false,
                onElementValidate: function(result, elm) {}
            },
            options || {});
            if (elm.className) {
                var cn = elm.className.split(/\s+/);
                for (var i = 0; i < cn.length; i++) {
                    var cssName = cn[i];
                    if (cssName == "ajax") {
                        var result = options.onElementValidateForAjax(elm);
                        if (result instanceof jValidation.ajax.Result) {
                            if (!result.result) {
                                var errorMsg = result.errorMsg;
                                jValidation.Validation.showErrorMsg(cssName, elm, errorMsg);
                                return false
                            }
                        }
                    } else {
                        var test = this.test(cssName, elm, options.useTitle);
                        options.onElementValidate(test, cssName);
                        if (!test) {
                            return false
                        }
                    }
                }
            }
            if (jValidation.util.hasClass(elm, "successed")) {
                jValidation.Validation.showSuccessMsg("successed", elm)
            }
            return true
        },
        test: function(cssName, elm, useTitle) {
            var Validation = jValidation.Validation;
            var v = this.get(cssName);
            var errorMsg = null;
            if (jValidation.util.isVisible(elm)) {
                errorMsg = v.testAndGetError(jValidation.util.getInputValue(elm), elm, useTitle)
            }
            if (errorMsg) {
                Validation.showErrorMsg(cssName, elm, errorMsg);
                return false
            } else {
                Validation.hideErrorMsg(cssName, elm);
                return true
            }
        },
        showErrorMsg: function(name, elm, errorMsg) {
            this.reset(elm);
            var jElm = $(elm);
            if (typeof jIPC != "undefined" && typeof jIPC.Tips != "undefined" && jValidation.Tips.useTips) {
                jIPC.Tips.tip($(elm), {
                    content: errorMsg,
                    position: jValidation.Tips.position,
                    showArrow: jValidation.Tips.showArrow
                })
            } else {
                var prop = jValidation.Validation._getAdviceProp(name);
                var advice = jValidation.Validation.getAdvice(name, elm);
                if (!jElm.attr(prop)) {
                    if (advice.size() == 0) {
                        advice = jValidation.Validation.newErrorMsgAdvice(name, elm, errorMsg);
                        advice = $(advice)
                    }
                }
                if (elm.type.toLowerCase() == "checkbox") {
                    if ($("#check-advice-" + jValidation.util.getElmID(elm)).size() == 0) {
                        var top = jValidation.util.getElementTop(elm) - 3,
                        left = jValidation.util.getElementLeft(elm) - 3,
                        elmWidth = elm.offsetWidth + 4,
                        elmHeight = elm.offsetHeight + 4,
                        errorDiv = $(("<div class='checkbox-error' id='check-advice-" + jValidation.util.getElmID(elm) + "'></div>")).appendTo(document.body);
                        errorDiv.css("left", left + "px");
                        errorDiv.css("top", top + "px");
                        errorDiv.css("width", elmWidth + "px");
                        errorDiv.css("height", elmHeight + "px")
                    }
                }
                if (advice && !jValidation.util.isVisible(advice[0])) {
                    advice.css("display", "")
                }
                advice.html(errorMsg);
                jElm.attr(prop, true)
            }
            jElm.removeClass("validation-passed");
            jElm.addClass("validation-failed")
        },
        showSuccessMsg: function(name, elm) {
            this.reset(elm);
            var jElm = $(elm);
            var prop = jValidation.Validation._getAdviceProp(name);
            var advice = jValidation.Validation.getAdvice(name, elm);
            if (!jElm.attr(prop)) {
                if (advice.size() == 0) {
                    advice = jValidation.Validation.newSuccessMsgAdvice(name, elm);
                    advice = $(advice)
                } else {
                    advice.removeClass("validation-advice");
                    advice.addClass("validation-success-advice");
                    advice.html("");
                    advice.show()
                }
            }
            jElm.attr(prop, true);
            jElm.addClass("validation-passed");
            jElm.removeClass("validation-failed")
        },
        newErrorMsgAdvice: function(name, elm, errorMsg) {
            var advice = '<div class="validation-advice" id="advice-' + name + "-" + jValidation.util.getElmID(elm) + '" style="display:none">' + errorMsg + "</div>";
            switch (elm.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                $(elm).after(advice);
                break;
            default:
                $(elm).after(advice)
            }
            advice = $("#advice-" + name + "-" + jValidation.util.getElmID(elm));
            return advice
        },
        newSuccessMsgAdvice: function(name, elm) {
            var advice = '<div class="validation-success-advice"  id="advice-' + name + "-" + jValidation.util.getElmID(elm) + '"></div>';
            switch (elm.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                var p = elm.parentNode;
                if (p) {
                    $(elm).before(advice)
                } else {
                    $(elm).after(advice)
                }
                break;
            case "input":
                $(elm).after(advice);
            default:
                $(elm).after(advice)
            }
            advice = $("#advice-" + name + "-" + jValidation.util.getElmID(elm));
            return advice
        },
        hideErrorMsg: function(name, elm) {
            var prop = jValidation.Validation._getAdviceProp(name);
            var advice = jValidation.Validation.getAdvice(name, elm);
            var jElm = $(elm);
            if (advice && jElm.attr(prop)) {
                advice.hide()
            }
            jElm.attr(prop, false);
            jElm.removeClass("validation-failed");
            jElm.addClass("validation-passed")
        },
        reset: function(elm) {
            var jElm = $(elm);
            if (typeof jIPC != "undefined" && typeof jIPC.Tips != "undefined" && jValidation.Tips.useTips) {
                if ($(elm).data("jtip")) {
                    $(elm).unbind("mouseover");
                    $(elm).data("jtip").tipWrap.remove()
                }
            } else {
                var className = jElm.attr("class");
                if (className) {
                    var cn = className.split(/\s+/);
                    for (var i = 0; i < cn.length; i++) {
                        var value = cn[i];
                        var prop = jValidation.Validation._getAdviceProp(value);
                        if (jElm.attr(prop)) {
                            var advice = jValidation.Validation.getAdvice(value, elm);
                            advice.hide();
                            jElm.attr(prop, "")
                        }
                    }
                }
            }
            jElm.removeClass("validation-failed");
            jElm.removeClass("validation-passed")
        },
        resetCheckbox: function(elm) {
            if (elm.checked) {
                this.reset(elm);
                $("#check-advice-" + jValidation.util.getElmID(elm)).remove()
            }
        },
        _getAdviceProp: function(validatorName) {
            return "__advice" + validatorName
        },
        getAdvice: function(name, elm) {
            if ($("#advice-" + name + "-" + jValidation.util.getElmID(elm)).size() > 0) {
                return $("#advice-" + name + "-" + jValidation.util.getElmID(elm))
            } else {
                return $("#advice-" + jValidation.util.getElmID(elm))
            }
        },
        get: function(cssName) {
            var Validation = jValidation.Validation;
            var resultMethodName = null;
            for (var methodName in Validation.methods) {
                if (cssName == methodName) {
                    resultMethodName = methodName;
                    break
                }
                if (cssName.indexOf(methodName) >= 0) {
                    resultMethodName = methodName
                }
            }
            return Validation.methods[resultMethodName] ? Validation.methods[resultMethodName] : new jValidation.Validator()
        },
        add: function(className, test, options) {
            var nv = {};
            var testFun = test;
            if (test instanceof RegExp) {
                testFun = function(v, elm, args, metadata) {
                    return test.test(v)
                }
            }
            nv[className] = new jValidation.Validator(className, testFun, options);
            $.extend(true, jValidation.Validation.methods, nv)
        },
        addAllThese: function(validators) {
            for (var i = 0; i < validators.length; i++) {
                var value = validators[i];
                jValidation.Validation.add(value[0], value[1], (value.length > 2 ? value[2] : {}))
            }
        },
        methods: {},
        validations: {}
    })
})(jQuery); (function(Validation) {
    Validation.addAllThese([["required",
    function(v) {
        return ! ((v == null) || (v.length == 0) || /^[\s|\u3000]+$/.test(v))
    },
    {
        ignoreEmptyValue: false
    }], ["invalidchar",
    function(v) {
        return (/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(v))
    }], ["validate-number",
    function(v) {
        return (!isNaN(v) && !/^\s+$/.test(v))
    }], ["validate-digits",
    function(v) {
        return ! /[^\d]/.test(v)
    }], ["validate-alphanum",
    function(v) {
        return ! /\W/.test(v)
    }], ["validate-one-required",
    function(v, elm) {
        var p = elm.parentNode;
        var options = p.getElementsByTagName("INPUT");
        return $A(options).any(function(elm) {
            return $F(elm)
        })
    },
    {
        ignoreEmptyValue: false
    }], ["validate-digits", /^[\d]+$/], ["validate-alphanum", /^[a-zA-Z0-9]+$/], ["validate-alpha", /^[a-zA-Z]+$/], ["validate-email", /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/], ["validate-url", /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i], ["validate-currency-dollar", /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/]]);
    Validation.addAllThese([["equals",
    function(v, elm, args, metadata) {
        return $("#" + args[0]).val() == v
    },
    {
        ignoreEmptyValue: false
    }], ["less-than",
    function(v, elm, args, metadata) {
        if (Validation.get("validate-number").test(v) && Validation.get("validate-number").test($("#" + args[0]))) {
            return parseFloat(v) < parseFloat($("#" + args[0]))
        }
        return v < $("#" + args[0])
    }], ["less-than-equal",
    function(v, elm, args, metadata) {
        var val = $("#" + args[0]).val();
        var reg = /^\d+(\.\d+)?$/;
        if (reg.test(v) && reg.test(val)) {
            return parseFloat(v) <= parseFloat(val)
        }
        return v < val || v == val
    }], ["great-than",
    function(v, elm, args, metadata) {
        if (Validation.get("validate-number").test(v) && Validation.get("validate-number").test($("#" + args[0]))) {
            return parseFloat(v) > parseFloat($("#" + args[0]))
        }
        return v > $("#" + args[0])
    }], ["great-than-equal",
    function(v, elm, args, metadata) {
        var val = $("#" + args[0]);
        if (Validation.get("validate-number").test(v) && Validation.get("validate-number").test(val)) {
            return parseFloat(v) >= parseFloat(val)
        }
        return v > val || v == val
    }], ["min-length",
    function(v, elm, args, metadata) {
        return v.length >= parseInt(args[0])
    }], ["max-length",
    function(v, elm, args, metadata) {
        return v.length <= parseInt(args[0])
    }], ["validate-file",
    function(v, elm, args, metadata) {
        return $("#" + args).any(function(extentionName) {
            return new RegExp("\\." + extentionName + "$", "i").test(v)
        })
    }], ["float-range",
    function(v, elm, args, metadata) {
        return (parseFloat(v) >= parseFloat(args[0]) && parseFloat(v) <= parseFloat(args[1]))
    },
    {
        depends: ["validate-number"]
    }], ["int-range",
    function(v, elm, args, metadata) {
        return (parseInt(v) >= parseInt(args[0]) && parseInt(v) <= parseInt(args[1]))
    },
    {
        depends: ["validate-integer"]
    }], ["length-range",
    function(v, elm, args, metadata) {
        return (v.length >= parseInt(args[0]) && v.length <= parseInt(args[1]))
    }], ["max-value",
    function(v, elm, args, metadata) {
        return parseFloat(v) <= parseFloat(args[0])
    },
    {
        depends: ["validate-number"]
    }], ["min-value",
    function(v, elm, args, metadata) {
        return parseFloat(v) >= parseFloat(args[0])
    },
    {
        depends: ["validate-number"]
    }], ["validate-pattern",
    function(v, elm, args, metadata) {
        return eval("(" + args.singleArgument + ".test(v))")
    }], ["validate-ajax",
    function(v, elm, args, metadata) {
        return true
    },
    {
        ignoreEmptyValue: false
    }], ["validate-dwr",
    function(v, elm, args, metadata) {
        var result = false;
        var callback = function(methodResult) {
            if (methodResult) {
                metadata._error = methodResult
            } else {
                result = true
            }
        };
        var call = args.singleArgument + "('" + v + "',callback)";
        DWREngine.setAsync(false);
        eval(call);
        DWREngine.setAsync(true);
        return result
    }], ["validate-buffalo",
    function(v, elm, args, metadata) {
        var result = false;
        var callback = function(reply) {
            if (replay.getResult()) {
                metadata._error = replay.getResult()
            } else {
                result = true
            }
        };
        if (!BUFFALO_END_POINT) {
            alert('not found "BUFFALO_END_POINT" variable')
        }
        var buffalo = new Buffalo(BUFFALO_END_POINT, false);
        buffalo.remoteCall(args.singleArgument, v, callback);
        return result
    }], ["validate-date",
    function(v, elm, args, metadata) {
        var dateFormat = args.singleArgument || "yyyy-MM-dd";
        metadata._error = jValidation.util.format(jValidation.util.getI18nMsg(metadata.className), [dateFormat, dateFormat.replace("yyyy", "2006").replace("MM", "03").replace("dd", "12")]);
        return jValidation.util.isDate(v, dateFormat)
    }], ["validate-selection",
    function(v, elm, args, metadata) {
        return elm.options ? elm.selectedIndex > 0 : !((v == null) || (v.length == 0))
    }], ["checkbox-required",
    function(v, elm, args, metadata) {
        return elm.checked
    }], ["validate-integer", /^[-+]?[1-9]\d*$|^0$/], ["validate-ip", /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/], ["validate-id-number",
    function(v, elm, args, metadata) {
        if (! (/^\d{17}(\d|x)$/i.test(v) || /^\d{15}$/i.test(v))) {
            return false
        }
        var provinceCode = parseInt(v.substr(0, 2));
        if ((provinceCode < 11) || (provinceCode > 91)) {
            return false
        }
        var forTestDate = v.length == 18 ? v: v.substr(0, 6) + "19" + v.substr(6, 15);
        var birthday = forTestDate.substr(6, 8);
        if (!jValidation.util.isDate(birthday, "yyyyMMdd")) {
            return false
        }
        if (v.length == 18) {
            v = v.replace(/x$/i, "a");
            var verifyCode = 0;
            for (var i = 17; i >= 0; i--) {
                verifyCode += (Math.pow(2, i) % 11) * parseInt(v.charAt(17 - i), 11)
            }
            if (verifyCode % 11 != 1) {
                return false
            }
        }
        return true
    }], ["validate-chinese", /^[\u4e00-\u9fa5]+$/], ["validate-phone", /^((0[1-9]{3})?(0[12][0-9])?[-])?\d{6,8}$/], ["validate-mobile-phone", /^0?(13[0-9]|15[012356789]|17[0123456789]|18[0123456789]|14[57])[0-9]{8}$/], ["validate-zip", /^[1-9]\d{5}$/], ["validate-qq", /^[1-9]\d{4,8}$/], ["validate-devid", /^[0-9A-Z]{6}$/], ["validate-space", /^[^\s]+$/]])
})(jValidation.Validation);


function openLogin()
{
	$('#myModal').modal();
		return;
}