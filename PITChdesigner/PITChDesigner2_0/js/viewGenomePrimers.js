/**
 * @namespace viewGenomePrimers
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @classdesc ジェノタイピング用のプライマーの位置関係を表示するクラス
 * @param {object} PITChdesigner デザイン済みの情報　（PITChdesigner class）
 * @param {string} targetID 描写先ID
 */
var viewGenomePrimers = viewGenomePrimers || {};
viewGenomePrimers = function(PITChdesigner, targetID) {

    ////OSに応じた変数
    this.linefeed = "";
    if (navigator.platform.indexOf("Win") != -1) {
        this.linefeed = "\r\n";
    } else {
        this.linefeed = "\n";
    }

    ////IDの設定
    this.targetID = targetID;
    this.buttonslideID = targetID + "_buttonslide";
    this.LjunctionbuttonID = targetID + "_Ljunctionbutton";
    this.RjunctionbuttonID = targetID + "_Rjunctionbutton";
    this.OutOutbuttonID = targetID + "_OObutton";
    this.ViewerID = targetID + "_Viewer";
    this.FormID = targetID + "_Form";
    this.DownloadButtonID = targetID + "_Download";
    this.DownloadLinkID = targetID + "_DownloadLink";
    ////描写先にHTMLタグを挿入
    this._initViewerHTML();
    ////座標と配列情報の設定
    //中央の位置
    this.centerX = 10000;
    //インサート
    this.insertarray = this._setInsertArray(PITChdesigner);
    //マイクロホモロジーの長さ
    this.lmh_len = PITChdesigner.retrieveDesign("LeftMHarray", 0).length;
    this.rmh_len = PITChdesigner.retrieveDesign("RightMHarray", 0).length;
    //境界面
    this.olp_border = this.centerX - this.insertarray.length / 2 - this.lmh_len;
    this.ilp_border = this.centerX - this.insertarray.length / 2;
    this.irp_border = this.centerX + this.insertarray.length / 2;
    this.orp_border = this.centerX + this.insertarray.length / 2 + this.rmh_len;
    //genotyping用 primer 情報
    this.pickedPrimer = {
        outerleft: PITChdesigner.pickGPrimer("outerleft", 3),
        outerright: PITChdesigner.pickGPrimer("outerright", 3),
        innerleft: PITChdesigner.pickGPrimer("innerleft", 3),
        innerright: PITChdesigner.pickGPrimer("innerright", 3)
    };
    ////vis.jsをクラスに内包する
    //groups
    this.groups = new vis.DataSet([{
        id: 'lgp',
        content: 'Forward primer',
        subgroupOrder: function(a, b) {
            return a.subgroupOrder - b.subgroupOrder;
        }
    }, {
        id: 'genome',
        content: 'Genome',
        subgroupOrder: 'subgroupOrder' // this group has no subgroups but this would be the other method to do the sorting.
    }, {
        id: 'rgp',
        content: 'Reverse primer',
        subgroupOrder: function(a, b) {
            return a.subgroupOrder - b.subgroupOrder;
        }
    }]);
    //items
    this.items = new vis.DataSet({
        type: {
            start: 'Number',
            end: 'Number'
        }
    });
    //itemsとprimerIDlistへ情報登録
    this.primerIDlist = {
        outerleft: [],
        innerleft: [],
        innerright: [],
        outerright: []
    }
    this._addAllToItems();
    //ビュワー描写先登録
    this.container = document.getElementById(this.ViewerID);
    //オプション登録
    this.options = {
        editable: {
            add: false, // add new items by double tapping
            updateTime: false, // drag items horizontally
            updateGroup: true, // drag items from one group to another
            overrideItems: false // allow these options to override item.editable
        },
        tooltip: {
            followMouse: true,
            overflowMethod: 'cap'
        },
        showMajorLabels: false,
        showMinorLabels: false,
        min: this.olp_border - 500,
        max: this.orp_border + 500
    };
    //vis.timelineインスタンスを生成
    this.timeline = new vis.Timeline(this.container, this.items, this.groups, this.options);

    ////プライマーボタン作成
    //プライマーボタンのID
    this.primerbuttonID = {};
    //プライマー情報からペアを作成し、ボタン作成とID名をつける
    this._makeAllPrimerButton();

}

/**
 * 描写先にHTMLタグを挿入する(private)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype._initViewerHTML = function() {
    var isSuccess = false;
    try {
        document.getElementById(this.targetID).innerHTML = "";
        document.getElementById(this.targetID).innerHTML =
            '<h3>Primer View for genotyping</h3>' +
            '<div class = "row">' +
            '<div class = "col-sm-4 carousel slide" data-ride="carousel" id = "' + this.buttonslideID + '">' +
            '<ol class="carousel-indicators">' +
            '<li data-target="#' + this.buttonslideID + '" data-slide-to="0" class="active"></li>' +
            '<li data-target="#' + this.buttonslideID + '" data-slide-to="1"></li>' +
            '<li data-target="#' + this.buttonslideID + '" data-slide-to="2"></li>' +
            '</ol>' +
            '<div class="carousel-inner" role="listbox">' +
            '<div class="item active">' +
            '<div id ="' + this.LjunctionbuttonID + '"></div>' +
            '</div>' +
            '<div class="item">' +
            '<div id ="' + this.RjunctionbuttonID + '"></div>' +
            '</div>' +
            '<div class="item">' +
            '<div id ="' + this.OutOutbuttonID + '"></div>' +
            '</div>' +
            '</div>' +
            '<a class="left carousel-control" href="#' + this.buttonslideID + '" role="button" data-slide="prev">' +
            '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '<a class="right carousel-control" href="#' + this.buttonslideID + '" role="button" data-slide="next">' +
            '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</div>' +
            '<div　class = "col-sm-8">' +
            '<div class="form-group col-sm-8">' +
            '<div id="' + this.ViewerID + '"></div>' +
            '<textarea class="form-control" id="' + this.FormID + '" rows="6" value = ""></textarea></div>' +
            '</div>' +
            '</div>' +
            '<button class="btn btn-default btn-block" id = "' + this.DownloadButtonID + '">DOWNLOAD SEQUENCE</button>' +
            '<a id = "' + this.DownloadLinkID + '" download = "GenotypingPrimerInfo.fa" hidden></a>';
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * インサート配列を選択して返す(private)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {object} PITChdesigner デザイン済みの情報　（PITChdesigner class）
 * @return {array} インサート配列
 */
viewGenomePrimers.prototype._setInsertArray = function(PITChdesigner) {
    var insertarray = [];
    try {
        if (PITChdesigner.getMethod("PrimerType") === "EGFP2APuroR") {
            insertarray = PITChdesigner.loadedVectorSeqList["EGFP2APuroRinsert"].split("");
        } else if (PITChdesigner.getMethod("PrimerType") === "CMV-EGFP2APuroR") {
            insertarray = PITChdesigner.loadedVectorSeqList["CMV-EGFP2APuroRinsert"].split("");
        } else if (PITChdesigner.getMethod("PrimerType") === "UserSet") {
            insertarray = PITChdesigner.retrieveData("userinsertarray");
        } else {
            throw new Error("Unexpected ward in this.getMethod(\"PrimerType\") == " + PITChdesigner.getMethod("PrimerType"));
        }
    } catch (e) {
        console.error(e);
    } finally {
        return insertarray;
    }
}

/**
 * 全ての情報をitemsへ追加する(private)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype._addAllToItems = function() {
    var isSuccess = false;
    try {
        //primer情報
        for (i = 1; i < 4; i++) {
            var primerinfo = this.pickedPrimer.outerleft[i - 1];
            if (primerinfo.failure_cause === "") {
                this.items.add([{
                    id: 'olgp' + i,
                    content: '<div>' + i + '</div>',
                    start: this.olp_border - (primerinfo.deltaend + primerinfo.length),
                    end: this.olp_border - (primerinfo.deltaend),
                    title: '<div>Outer Left Primer #' + i + '</div>' +
                        '<br><div>Sequence : ' + primerinfo.primer + '</div>' +
                        '<br><div>Tm : ' + Math.floor(primerinfo.Tm) + '˚C</div>' +
                        '<br><div>GC : ' + Math.floor(primerinfo.CGcont) + '%</div>',
                    group: 'lgp',
                    subgroup: 'sg_' + i,
                    subgroupOrder: 0,
                    meta: { //独自設定
                        Seq: primerinfo.primer,
                        Tm: Math.floor(primerinfo.Tm),
                        GC: Math.floor(primerinfo.CGcont),
                        deltaend: primerinfo.deltaend,
                        seqlength: primerinfo.length
                    }
                }]);
                this.primerIDlist.outerleft.push('olgp' + i);
            }
            primerinfo = this.pickedPrimer.outerright[i - 1];
            if (primerinfo.failure_cause === "") {
                this.items.add([{
                    id: 'orgp' + i,
                    content: '<div>' + i + '</div>',
                    start: this.orp_border + primerinfo.deltaend,
                    end: this.orp_border + (primerinfo.deltaend + primerinfo.length),
                    title: '<div>Outer Right Primer #' + i + '</div>' +
                        '<br><div>Sequence : ' + primerinfo.primer + '</div>' +
                        '<br><div>Tm : ' + Math.floor(primerinfo.Tm) + '˚C</div>' +
                        '<br><div>GC : ' + Math.floor(primerinfo.CGcont) + '%</div>',
                    group: 'rgp',
                    subgroup: 'sg_' + i,
                    subgroupOrder: 0,
                    meta: { //独自設定
                        Seq: primerinfo.primer,
                        Tm: Math.floor(primerinfo.Tm),
                        GC: Math.floor(primerinfo.CGcont),
                        deltaend: primerinfo.deltaend,
                        seqlength: primerinfo.length
                    }
                }]);
                this.primerIDlist.outerright.push('orgp' + i);
            }
            primerinfo = this.pickedPrimer.innerleft[i - 1];
            if (primerinfo.failure_cause === "") {
                this.items.add([{
                    id: 'ilgp' + i,
                    content: '<div>' + i + '</div>',
                    start: this.ilp_border + primerinfo.deltaend,
                    end: this.ilp_border + (primerinfo.deltaend + primerinfo.length),
                    title: '<div>Inner Left Primer #' + i + '</div>' +
                        '<br><div>Sequence : ' + primerinfo.primer + '</div>' +
                        '<br><div>Tm : ' + Math.floor(primerinfo.Tm) + '˚C</div>' +
                        '<br><div>GC : ' + Math.floor(primerinfo.CGcont) + '%</div>',
                    group: 'lgp',
                    subgroup: 'sg_' + i,
                    subgroupOrder: 0,
                    meta: { //独自設定
                        Seq: primerinfo.primer,
                        Tm: Math.floor(primerinfo.Tm),
                        GC: Math.floor(primerinfo.CGcont),
                        deltaend: primerinfo.deltaend,
                        seqlength: primerinfo.length
                    }
                }]);
                this.primerIDlist.innerleft.push('ilgp' + i);
            }
            primerinfo = this.pickedPrimer.innerright[i - 1];
            if (primerinfo.failure_cause === "") {
                this.items.add([{
                    id: 'irgp' + i,
                    content: '<div>' + i + '</div>',
                    start: this.irp_border - (primerinfo.deltaend + primerinfo.length),
                    end: this.irp_border - primerinfo.deltaend,
                    title: '<div>Inner Right primer #' + i + '</div>' +
                        '<br><div>Sequence : ' + primerinfo.primer + '</div>' +
                        '<br><div>Tm : ' + Math.floor(primerinfo.Tm) + '˚C</div>' +
                        '<br><div>GC : ' + Math.floor(primerinfo.CGcont) + '%</div>',
                    group: 'rgp',
                    subgroup: 'sg_' + i,
                    subgroupOrder: 0,
                    meta: { //独自設定
                        Seq: primerinfo.primer,
                        Tm: Math.floor(primerinfo.Tm),
                        GC: Math.floor(primerinfo.CGcont),
                        deltaend: primerinfo.deltaend,
                        seqlength: primerinfo.length
                    }
                }]);
                this.primerIDlist.innerright.push('irgp' + i);
            }
            console.log("//////delta//////");
            console.log(this.pickedPrimer.outerleft[i - 1].deltaend);
            console.log(this.pickedPrimer.outerright[i - 1].deltaend);
            console.log(this.pickedPrimer.innerleft[i - 1].deltaend);
            console.log(this.pickedPrimer.innerright[i - 1].deltaend);
        }
        //インサート・末端情報
        //ゲノムインサート情報
        this.items.add([{
            id: '5end',
            content: '<div class="text-right">5\'end</div>',
            start: this.olp_border - 500,
            end: this.ilp_border,
            title: '<div>5\'end region</div>',
            type: 'background',
            group: 'genome'
        }, {
            id: 'goi',
            content: '<div class="text-center">Insert</div>',
            start: this.ilp_border,
            end: this.irp_border,
            title: '<div>Insert Sequence</div><br><div>' + this.insertarray.length + 'bp</div>',
            type: 'range',
            group: 'genome'
        }, {
            id: '3end',
            content: '<div class="text-left">3\'end</div>',
            start: this.irp_border,
            end: this.orp_border + 500,
            title: '<div>3\'end region</div>',
            type: 'background',
            group: 'genome'
        }, {
            id: 'select',
            content: '<div></div>',
            start: 0,
            end: 0,
            title: '<div></div>',
            type: 'background'
        }])
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * プライマー情報からペアを作成し、ボタン作成とID名をつける
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype._makeAllPrimerButton = function() {
    var isSuccess = false;
    try {
        //left
        //変数設定
        var madeHTML = '<h4 class="text-center">Primers for Left junction PCR</h4>';
        var pairnum = 1;
        var pairtype = "left";
        //ボタン作成
        for (var forward of this.primerIDlist.outerleft) {
            for (var reverse of this.primerIDlist.innerleft) {
                madeHTML += '<button type="button" class="btn btn-default btn-block" id = "primerbutton-' + pairtype + '-' + forward + '-' + reverse + '">No' + pairnum + '</button>';
                pairnum += 1;
            }
        }
        //空ボタン作成
        for (var breakcnt = 10 - pairnum; breakcnt > 0; breakcnt--) {
            madeHTML += '<button type="button" class="btn btn-default btn-block" disabled">-</button>';
        }
        //範囲調整のための改行
        for (var breakcnt = 0; breakcnt < 4; breakcnt++) madeHTML += '<br>';
        //書き込み
        document.getElementById(this.LjunctionbuttonID).innerHTML = madeHTML;

        //right / out に関しても同様の記載方法

        //right
        madeHTML = '<h4 class="text-center">Primers for Right junction PCR</h4>';
        pairnum = 1;
        pairtype = "right";
        for (var forward of this.primerIDlist.innerright) {
            for (var reverse of this.primerIDlist.outerright) {
                madeHTML += '<button type="button" class="btn btn-default btn-block" id = "primerbutton-' + pairtype + '-' + forward + '-' + reverse + '">No' + pairnum + '</button>';
                pairnum += 1;
            }
        }
        for (var breakcnt = 10 - pairnum; breakcnt > 0; breakcnt--) {
            madeHTML += '<button type="button" class="btn btn-default btn-block" disabled">-</button>';
        }
        for (var breakcnt = 0; breakcnt < 4; breakcnt++) madeHTML += '<br>';
        document.getElementById(this.RjunctionbuttonID).innerHTML = madeHTML;

        //out
        madeHTML = '<h4 class="text-center">Primers for Out-Out PCR</h4>';
        pairnum = 1;
        pairtype = "out";
        for (var forward of this.primerIDlist.outerleft) {
            for (var reverse of this.primerIDlist.outerright) {
                madeHTML += '<button type="button" class="btn btn-default btn-block" id = "primerbutton-' + pairtype + '-' + forward + '-' + reverse + '">No' + pairnum + '</button>';
                pairnum += 1;
            }
        }
        for (var breakcnt = 10 - pairnum; breakcnt > 0; breakcnt--) {
            madeHTML += '<button type="button" class="btn btn-default btn-block" disabled">-</button>';
        }
        for (var breakcnt = 0; breakcnt < 4; breakcnt++) madeHTML += '<br>';
        document.getElementById(this.OutOutbuttonID).innerHTML = madeHTML;

        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * PCR情報をbuttonID名を元に抽出する
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} buttonID ボタンのID
 * @return {object} PCR情報
 */
viewGenomePrimers.prototype._extractPCRinfo = function(buttonID) {
    var PCRinfo = {
        forward: "",
        reverse: "",
        type: "",
        start: 0,
        end: 0,
        length: 0,
        TmMax: 0,
        TmMin: 0,
        GCMax: 0,
        GCMin: 0
    };
    try {
        //ID解析
        var button, type, forward, reverse;
        [button, type, forward, reverse] = buttonID.split("-");
        if (button !== "primerbutton") throw ("Input ID cannot be accepted.");
        var fp = this.items.get(forward);
        var rp = this.items.get(reverse);
        [PCRinfo.forward, PCRinfo.reverse, PCRinfo.type, PCRinfo.start, PCRinfo.end] = [fp.meta.Seq, rp.meta.Seq, type, fp.start, rp.end];
        PCRinfo.length = 0;
        if (fp.group === "lgp" && rp.group === "lgp") {
            PCRinfo.length = fp.meta.seqlength + fp.meta.deltaend + rp.meta.deltaend + rp.meta.seqlength + this.lmh_len;
        } else if (fp.group === "rgp" && rp.group === "rgp") {
            PCRinfo.length = fp.meta.seqlength + fp.meta.deltaend + rp.meta.deltaend + rp.meta.seqlength + this.rmh_len;
        } else if (fp.group === "lgp" && rp.group === "rgp") {
            PCRinfo.length = fp.meta.seqlength + fp.meta.deltaend + rp.meta.deltaend + rp.meta.seqlength + this.lmh_len + this.rmh_len + this.insertarray.length;
        }
        PCRinfo.TmMax = Math.max(fp.meta.Tm, rp.meta.Tm);
        PCRinfo.TmMin = Math.min(fp.meta.Tm, rp.meta.Tm);
        PCRinfo.GCMax = Math.max(fp.meta.GC, rp.meta.GC);
        PCRinfo.GCMin = Math.min(fp.meta.GC, rp.meta.GC);
    } catch (e) {
        console.error(e);
    } finally {
        return PCRinfo;
    }
};

/**
 * PCR情報をビュワーへ反映する
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} buttonID ボタンのID
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype.reflectPCRinfoView = function(buttonID) {
    var isSuccess = false
    try {
        var pcrinfo = this._extractPCRinfo(buttonID);
        this.items.update([{
            id: 'select',
            content: '<div class="text-center">' + pcrinfo.length + ' bp<br>' +
                'MaxTm : ' + pcrinfo.TmMax + ' ˚C<br>' +
                'CG : ' + pcrinfo.GCMin + '-' + pcrinfo.GCMax + ' %<br>' +
                '</div>',
            start: pcrinfo.start,
            end: pcrinfo.end,
            title: '<div></div>',
            type: 'background'
        }])
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * ビュワーへ反映されたPCR情報を消去する
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype.clearPCRinfoView = function() {
    var isSuccess = false
    try {
        this.items.update([{
            id: 'select',
            content: '<div></div>',
            start: 0,
            end: 0,
            title: '<div></div>',
            type: 'background'
        }])
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * PCR情報をテキストボックスへ反映する
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} buttonID ボタンのID
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype.enterPCRinfoText = function(buttonID) {
    var isSuccess = false;
    try {
        var pcrinfo = this._extractPCRinfo(buttonID);
        console.log($('#' + buttonID).text());
        var prefix = ">";
        if (pcrinfo.type === "left") {
            prefix += "Left_Junction_PCR_Primer ";
        } else if (pcrinfo.type === "right") {
            prefix += "Right_Junction_PCR_Primer ";
        } else if (pcrinfo.type === "out") {
            prefix += "Out-Out_PCR_Primer ";
        }
        prefix += $('#' + buttonID).text() +
            ' (PCRlength' + pcrinfo.length + 'bp/' +
            'MaxTm' + pcrinfo.TmMax + '˚C/' +
            'GC' + pcrinfo.GCMin + '-' + pcrinfo.GCMax + '%)';
        //fasta形式のプライマー情報作成
        var fasta = prefix + "forward" + this.linefeed + pcrinfo.forward + this.linefeed +
            prefix + " reverse" + this.linefeed + pcrinfo.reverse + this.linefeed;
        //テキストエリアに追加代入
        $('#' + this.FormID).val($('#' + this.FormID).val() + fasta);
        //スクロール
        $('#' + this.FormID).scrollTop($('#' + this.FormID)[0].scrollHeight);
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
};

/**
 * テキストエリアの情報をダウンロードする（ボタン要素のクリックを想定）
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} 成功したかどうか
 */
viewGenomePrimers.prototype.downloadText = function() {
    var isSuccess = false;
    try {
        //テキスト読み込み
        var content = $('#' + this.FormID).val();
        //Windowsの場合は改めてコードを入れる
        if (navigator.platform.indexOf("Win") != -1) {
            var linearr = content.split("\r\n");
            content = "";
            for (var lineind in linearr) {
                content += linearr[lineind] + "\r\n";
            }
        }
        console.log(content);
        //blob作成
        var blob = new Blob([content], { "type": "text/plain" });
        if (window.navigator.msSaveBlob) { //For IE10
            window.navigator.msSaveBlob(blob, "GenotypingPrimerInfo.fa");
            // [J]msSaveOrOpenBlobの場合はファイルを保存せずに開ける
            window.navigator.msSaveOrOpenBlob(blob, text);
        } else { //For others
            document.getElementById(this.DownloadLinkID).href = window.URL.createObjectURL(blob);
        }
        //document.getElementById(this.DownloadLinkID).download = "GenotypingPrimerInfo.fa";
        document.getElementById(this.DownloadLinkID).click();
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
};