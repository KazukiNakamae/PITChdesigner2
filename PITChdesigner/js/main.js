/*!
 * main.js
 * Copyright 2016 Kazuki Nakamae
 * Licensed under the MIT license
 *2017/12/15 updated
 */
/////////////////////////////decleation///////////////////////////////////////


/****************************************************************************
 *	Wrapper class
 ****************************************************************************/

/**
 * @namespace PITChdesigner
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.1
 * @classdesc PITCh designer に合わせたknockinjsのdesignCRISPITCh()とoligotmjsのラッパークラス
 * @extends inputSequence
 * @param {string} [inputTitle=no_title]        タイトル
 * @param {string} [inputSeq]          標的配列
 * @param {number} [shiftedFrameNum=0]   リーディングフレーム
 * @param {number} [inputtargetedPos=41]  標的位置
 * @param {string} [userInsert=""]  挿入配列 (optional)
 * @param {function} [evalPrimerFunc=function(x) { return x.length; }]  ベクター構築用プライマー設計時に使う評価関数 (optional)
 * If setting userInsert, forced to change "PrimerType" to "UserSet"
 */
var PITChdesigner = PITChdesigner || {};
PITChdesigner = function(inputTitle, inputSeq, shiftedFrameNum, inputtargetedPos, userInsert, evalPrimerFunc) {
    //既存メンバ変数の継承
    designCRISPITCh.call(this, inputTitle, inputSeq, shiftedFrameNum, inputtargetedPos, userInsert, evalPrimerFunc);
    //oligotmjsを内包する
    this.oligotm = new oligotm();
    //genotyping用のプライマー設定
    this.Tmrange = {
        min: 62,
        max: 68
    };
    this.CGrange = {
        min: 20,
        max: 80
    };
}

//methodの継承
setInherits(PITChdesigner, designCRISPITCh);

/**
 * advanced optionsに記載されたパラメーターをセットする。htmlからの読み取りについてはmain部分に委ねる
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.1
 * @param  {all} inputData 値
 * @param  {?("GPTmMax"|"GPTmMin"|"GPCGMax"|"GPCGMin")} inputDataType 入力タイプ
 * @return {boolean} 成功したかどうか
 */
PITChdesigner.prototype.setOptions = function(inputData, inputDataType) {
    var isSuccess = false;
    try {
        if (inputDataType === "GPTmMax") {
            if (typeof inputData === 'number') {
                this.Tmrange.max = inputData;
            } else {
                throw new Error("input data is not number");
            }
        } else if (inputDataType === "GPTmMin") {
            if (typeof inputData === 'number') {
                this.Tmrange.min = inputData;
            } else {
                throw new Error("input data is not number");
            }
        } else if (inputDataType === "GPCGMax") {
            if (typeof inputData === 'number') {
                this.CGrange.max = inputData;
            } else {
                throw new Error("input data is not number");
            }
        } else if (inputDataType === "GPCGMin") {
            if (typeof inputData === 'number') {
                this.CGrange.min = inputData;
            } else {
                throw new Error("input data is not number");
            }
        } else {
            throw new Error("Undefined DataType : " + inputDataType);
        }
        console.info("[Set] " + inputDataType + " : " + inputData);
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
}

/**
 * Calculate Tm value.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} seq sequence
 * @param  {number} dna_conc DNA concentration (nanomolar)
 * @param  {number} salt_conc concentration of salt
 * @param  {number} divalent_conc Salt concentration (millimolar)
 * @param {number} dntp_conc Concentration of dNTPs (millimolar)
 * @param {number} tm_method member of this.tm_method_type
 * @param {number} salt_corrections member of this.salt_correction_type
 * @return {number} Tm value (Celsius)
 * note  if an error occurs, return 0.
 */
PITChdesigner.prototype.calcTm = function(seq, dna_conc, salt_conc, divalent_conc, dntp_conc, tm_method, salt_corrections) {
    var Tmvalue;
    try {
        if (typeof seq === "undefined") {
            throw new Error("argument \"seq\" is null : DNA string argument required.");
        }
        //The default arguments
        if (typeof dna_conc === "undefined") {
            dna_conc = 50;
        }
        if (typeof salt_conc === "undefined") {
            salt_conc = 50;
        }
        if (typeof divalent_conc === "undefined") {
            divalent_conc = 0;
        }
        if (typeof dntp_conc === "undefined") {
            dntp_conc = 0;
        }
        if (typeof tm_method === "undefined") {
            tm_method = 0;
        }
        if (typeof salt_corrections === "undefined") {
            salt_corrections = 0;
        }
        //check argument
        if (typeof seq !== 'string') {
            throw new Error("argument \"seq\" is wrong type : string object argument required.");
        } else if (seq === "") {
            throw new Error("argument \"seq\" is null string.");
        }
        //calculate CG percent
        Tmvalue = this.oligotm.oligotm(seq, dna_conc, salt_conc, divalent_conc, dntp_conc, tm_method, salt_corrections);
        if (Tmvalue === -Infinity) {
            throw new Error("Tm value can't be calculated.");
        }
    } catch (e) {
        console.error(e);
        Tmvalue = 0;
    }
    return Tmvalue;
}

/**
 * Calculate CG contents.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} seq sesuences
 * @return  {number} CGcontents (persentage 0-100 %)
 * note  if an error occurs, return 0.
 */
PITChdesigner.prototype.calcCGcontents = function(seq) {
    var CGpercent;
    try {
        //check argument
        if (typeof seq !== 'string') {
            throw new Error("argument \"seq\" is wrong type : string object argument required.");
        } else if (seq === "") {
            throw new Error("argument \"seq\" is null string.");
        }
        //calculate CG percent
        CGcontents = seq.split(/[CG]/i).length - 1;
        CGpercent = CGcontents / seq.length * 100;
    } catch (e) {
        console.error(e);
        CGpercent = 0;
    }
    return CGpercent;
}

/**
 * genotyping 用のプライマーを設定に従って選別し出力する
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.1
 * @param {?("outerleft" | "outerright"|"innerleft" | "innerright")} direction direction of primer
 * @param {number} [pickNum=max] 出力するプライマーの上限値
 * @return {object} プライマー配列と各情報を記したリスト
 * ({primer:プライマー配列
 * , deltaend:末端からのプライマーの距離
 * , Tm:oligotm() にしたがったプライマーのTm値
 * , CGcont:プライマーのCG%
 * })
 * 
 */
PITChdesigner.prototype.pickGPrimer = function(direction, pickNum) {
    var outpickList = [];
    var failure_cause = ""; //取得失敗の原因記述
    try {
        var originalList = [];
        if (direction === "outerleft") {
            originalList = this.outerleftgenomeprimers;
        } else if (direction === "outerright") {
            originalList = this.outerrightgenomeprimers;
        } else if (direction === "innerleft") {
            originalList = this.innerleftgenomeprimers;
        } else if (direction === "innerright") {
            originalList = this.innerrightgenomeprimers;
        } else {
            throw new Error("argument \"direction\" is wrong : \"outerleft\" or \"outerright\" or \"innerleft\" or \"innerright\" required.");
        }
        //デフォルト引数
        if (typeof pickNum === 'undefined') {
            pickNum = originalList.length;
        }
        var pickList = [];
        var originalLen = originalList.length;
        if (originalLen < 1) {
            failure_cause = "Due to inadequate distance from junction (100 bp - 200 bp) or no CG sequence"
            throw new Error("Primer list is null.");
        }
        //Tm 値とCG% でフィルター
        for (var primerinfo of originalList) {
            primerinfo['length'] = primerinfo.primer.length;
            primerinfo['Tm'] = this.calcTm(primerinfo.primer);
            if (!(this.Tmrange.min <= primerinfo['Tm'] && this.Tmrange.max >= primerinfo['Tm'])) {
                continue;
            }
            primerinfo['CGcont'] = this.calcCGcontents(primerinfo.primer);
            if (!(this.CGrange.min <= primerinfo['CGcont'] && this.CGrange.max >= primerinfo['CGcont'])) {
                continue;
            }
            // 形式的にfailure_causeを加える
            primerinfo.failure_cause = failure_cause
            pickList.push(primerinfo);
        }
        //長さでソーティング
        var sortedpickList = this.sortObjarray(pickList, "length", "desc");
        //取れるだけ取得し、指定数に達しない場合は配列のないオブジェクトを詰め込む
        var count = 0;
        var fltrLen = sortedpickList.length;
        if (fltrLen < 1) {
            failure_cause = "Because Tm or CG contents of candidate primers are out of range"
            throw new Error("Primer list is null.");
        }
        for (var primerinfo of sortedpickList) {
            //取得分取得する
            if (count < pickNum) {
                outpickList.push(primerinfo);
            } else {
                break;
            }
            count++;
        }
        //取得数に達していない場合はその分を埋めておく
        while (count < pickNum) {
            if (originalLen < pickNum) {
                failure_cause = "Due to inadequate distance from junction (100 bp - 200 bp) or no CG sequence"
            } else if (fltrLen < pickNum) {
                failure_cause = "Because Tm or CG contents of candidate primers are out of range"
            }
            outpickList.push({ primer: "Designable region was not found. There may be a problem with the setting.", deltaend: null, Tm: null, CGcont: null, failure_cause: failure_cause });
            count++;
        }
    } catch (e) {
        console.error(e);
        if (e.message == "Primer list is null.") {
            for (var count = 0; count < pickNum; count++) {
                outpickList.push({ primer: "Designable region was not found. There may be a problem with the setting.", deltaend: null, Tm: null, CGcont: null, failure_cause: failure_cause });
            }
        } else {
            outpickList = null;
        }
    }
    //戻り値のチェック
    //console.log(direction);
    //console.log(outpickList);
    return outpickList;
};

/****************************************************************************
 *	Class decleation
 ****************************************************************************/


/**
 * English comments (incomplete version) [:E]
 * Defining classes refered to https://developer.mozilla.org/en/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 *
 *	controlMainStatus is implementation of defining display pattern on PITChdesiner.html.
 **
 * Japaniese comments[:J]
 *	参考としたクラスの実装方法：https://developer.mozilla.org/ja/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 */

/**
 *	PITChdesiner.htmlでの表示モードを定義するクラス
 */
/**
 * Namespace
 */
var controlMainStatus = controlMainStatus || {};
/**
 * Constructor
 */
controlMainStatus = function() {
    //コドンに変換した表示をするか否か (boolean value)
    this.isNoframe = false;
    //生物種 (String value)
    this.species = "";
    //エラー表示されているid箇所 (boolean value)
    this.errorId = "";
};
/**
 * [J]
 * 表示モードを決定するパラメーターの値を設定する。
 * @param	inputData 入力データ, 入力データの種類に応じた型の検証は行っていない。
 * @param 	inputDataType 入力データの種類 (String global object) ,対応していない種類を入れると異常終了
 * @return	isSuccess 正しい処理がなされたかどうかを返す。(true:正常終了/false:異常終了)
 */
controlMainStatus.prototype.setStatus = function(inputData, inputDataType) {
    var isSuccess = false;
    try {
        if (inputDataType == "noframe") {
            this.isNoframe = inputData;
            console.info("[Set] controlMainStatus.isNoframe : " + this.isNoframe);
        } else if (inputDataType == "species") {
            this.species = inputData;
            console.info("[Set] controlMainStatus.species : " + this.species);
        } else if (inputDataType == "errorId") {
            this.errorId = inputData;
            console.info("[Set] controlMainStatus.errorId : " + this.errorId);
        } else {
            throw new Error("Undefined DataType:" + inputDataType);
        }
        isSuccess = true;
    } catch (e) {
        console.error(e)
    } finally {
        return isSuccess;
    }
};

/**
 * [J]
 * 表示モードを決定するパラメーターの値を取り出す。
 * @param	inputDataType 出力データの種類 (String global object) ,対応していない種類を入れるとエラー表示
 * @return	returnedData 取り出されたデータ(失敗時：null)
 */
controlMainStatus.prototype.getStatus = function(getDataType) {
    var returnedData = null;
    try {
        if (getDataType === "noframe") {
            returnedData = this.isNoframe;
        } else if (getDataType === "species") {
            returnedData = this.species;
        } else if (getDataType === "errorId") {
            returnedData = this.errorId;
        } else {
            throw new Error("Undefined DataType:" + inputDataType);
        }
    } catch (e) {
        console.error(e)
    } finally {
        return returnedData;
    }
};



/**
 * [J]
 *	設計した配列のSUMARRY情報を扱うクラス
 */
/**
 * Namespace
 */
var makeSummary = makeSummary || {};
/**
 * Constructor
 */
makeSummary = function() {
    //[J]表示するSUMARRY (String global object , TSV format)
    this.shownSummary = null;
    this.shownTitle = "no_title";
};

/**[J]
 *Summaryを作成する
 *	@param	designCRISPITChInstamce デザインした情報　（designCRISPITCh class）
 */
makeSummary.prototype.inputSummary = function(designCRISPITChInstamce) {
        //プライマーリストを取得
        var pickedPrimer = {
            outerleft: designCRISPITChInstamce.pickGPrimer("outerleft", 3),
            outerright: designCRISPITChInstamce.pickGPrimer("outerright", 3),
            innerleft: designCRISPITChInstamce.pickGPrimer("innerleft", 3),
            innerright: designCRISPITChInstamce.pickGPrimer("innerright", 3)
        }
        this.shownSummary = "Name\tNo.\tsgRNA orientation\tsgRNA target sequence (plus strand)\t" +
            "Left microhomology\tRight microhomology\tDesirable labels\tUndesirable labels\t5' forward primer\t5' reverse primer\t" +
            "3' forward primer\t3' reverse primer\t5' sequence of knockin vector\t3' sequence of knockin vector\t" +
            "Sence oligonucleotide for constructing pU6 sgRNA expression vector\tAntisence oligonucleotide for constructing pU6 sgRNA expression vector\t" +
            "Outer left primer(1)\tOuter left primer(2)\tOuter left primer(3)\t" +
            "Outer right primer(1)\tOuter right primer(2)\tOuter right primer(3)\t" +
            "Inner left primer(1)\tInner left primer(2)\tInner left primer(3)\t" +
            "Inner left primer(1)\tInner left primer(2)\tInner left primer(3)\t" +
            "Whole sequence of knock-in targeting vector" +
            "\n";
        for (var countDraft = 0; designCRISPITChInstamce.hasAllDesign(countDraft, ["Seq"]) == true; countDraft++) {
            this.shownSummary += designCRISPITChInstamce.retrieveData("title") + "\t" + (countDraft + 1) + "\t" +
                designCRISPITChInstamce.retrieveDesign("Direction", countDraft) + "\t" +
                designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("LeftMHarrayOnly", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("RightMHarray", countDraft).join("") + "\t" +
                getDesirableFeature(designCRISPITChInstamce.retrieveDesign("Direction", countDraft), designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft).join("")).replace(',', ';') + "\t" +
                getUndesirableFeature(designCRISPITChInstamce.retrieveDesign("Direction", countDraft), designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft).join("")).replace(',', ';') + "\t" +
                designCRISPITChInstamce.retrieveDesign("5fwdprimer", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("5revprimer", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("3fwdprimer", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("3revprimer", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("5vector", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("3vector", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("pU6gRNAsense", countDraft).join("") + "\t" +
                designCRISPITChInstamce.retrieveDesign("pU6gRNAantisense", countDraft).join("") + "\t" +
                pickedPrimer.outerleft[0].primer + "\t" +
                pickedPrimer.outerleft[1].primer + "\t" +
                pickedPrimer.outerleft[2].primer + "\t" +
                pickedPrimer.outerright[0].primer + "\t" +
                pickedPrimer.outerright[1].primer + "\t" +
                pickedPrimer.outerright[2].primer + "\t" +
                pickedPrimer.innerleft[0].primer + "\t" +
                pickedPrimer.innerleft[1].primer + "\t" +
                pickedPrimer.innerleft[2].primer + "\t" +
                pickedPrimer.innerright[0].primer + "\t" +
                pickedPrimer.innerright[1].primer + "\t" +
                pickedPrimer.innerright[2].primer + "\t" +
                designCRISPITChInstamce.retrieveDesign("wholevector", countDraft).join("") + "\n";
            //console.log(pickedPrimer.outerright[2]);
        }
        //[J]表示するSUMARRYのタイトル (String global object)
        this.shownTitle = designCRISPITChInstamce.retrieveData('title')
    }
    /**[J]
     *Summaryを出力する
     *@return this.shownSummary Summary情報(String global object , TSV format or null)
     */
makeSummary.prototype.getSummary = function() {
    return (this.shownSummary);
};
/**[J]
 *リンクタグ<a href="">へCSVファイルを出力する
 *@param placedID リンクタグのID(String global object)
 */
makeSummary.prototype.downloadSummaryCSV = function(placedID) {
    var content = this.shownSummary.replace(/\t/g, ',');
    var blob = new Blob([content], { "type": "text/csv" });
    if (window.navigator.msSaveBlob) { //For IE10
        window.navigator.msSaveBlob(blob, this.shownTitle + ".csv");
        // [J]msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        window.navigator.msSaveOrOpenBlob(blob, this.shownTitle + ".csv");
    } else if (document.getElementById(placedID) != null) { //For others
        document.getElementById(placedID).href = window.URL.createObjectURL(blob);
    }
}

/****************************************************************************
 *	jQuery function decleation
 ****************************************************************************/

/**
 * 値をidと認識して、アコーディオンを展開する。
 */
$('document').ready(function() {

    $(".accordion-dropdpwn").on('change', function(e) {
        var selected_value = $(this).val();
        selected_value = "#" + selected_value;
        var $target_elem = $('a[href="' + selected_value + '"]');
        $target_elem.trigger('click');
    });

    $('.accordion-toggle').on('click', function() {
        var selected_value = $(this).attr('href');
        $(".accordion-dropdown option").removeAttr('selected');
        $('option[value="' + selected_value + '"]').attr('selected', 'selected');
    });

    $(".accordion-toggle").trigger('change');

});

/**
 * body内の指定idタグ領域へスクロールする。
 * @param {string} id スクロール先id名
 */
var scrollID = function(id) {
    $("html,body").animate({ scrollTop: $('#' + id).offset().top });
};


/****************************************************************************
 *	function decleation
 ****************************************************************************/

/**
 * Tm値を算出する。ただし、上限値を超えたものは0とする。（CRISPITChdesignerの評価関数に適用可能）
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param sequence {string} 評価する塩基配列
 * @return	{number} Tm値
 */
var selPrimer = function(sequence) {
    var instance = new oligotm();
    var Tmvalue = instance.oligotm(sequence, 50, 50, 0, 0, 0, 0) // primer3 default setting
    if ((typeof Tmvalue !== 'number') || (Math.floor(Tmvalue) > 72)) {
        Tmvalue = -Infinity;
    }
    //debug
    //console.log(Tmvalue);
    return Tmvalue;
};

/**
 * 指定した小数点で丸める。
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param  {number} value 丸める値
 * @param  {number} point 丸める位置
 */
var roundNumber = function(value, point) {
    var _pow = Math.pow(10, point);
    return Math.round(value * _pow) / _pow;
}

/**
 * Tm値を算出し、Primer3と同じように第一小数点までを返す。
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param sequence {string} 評価する塩基配列
 * @return	{number} Tm値
 */
calcPrimer = function(sequence) {
    try {
        var calcTmObj = new oligotm();
        var Tmvalue = calcTmObj.oligotm(sequence, 50, 50, 0, 0, 0, 0); // primer3 default setting
        if (typeof Tmvalue !== 'number') {
            Tmvalue = -Infinity;
            throw new Error("return value is not number. : " + Tmvalue);
        }
        //debug
        console.log(Tmvalue);
        Tmvalue = roundNumber(Tmvalue, 1);
    } catch (e) {
        console.error(e);
    }
    return Tmvalue;
};

/**
 * リンクタグ<a href="">へテキストファイルを出力する
 * @param {string} title テキストファイルのタイトル（拡張子入り）
 * @param {string} text テキストファイルの内容
 * @param {string} placedID リンクタグのID
 */
downloadText = function(title, text, placedID) {
    if (navigator.platform.indexOf("Win") != -1) {
        var content = ">" + title + "\r\n" + text;
    } else {
        var content = ">" + title + "\n" + text;
    }
    console.log(content);
    var blob = new Blob([content], { "type": "text/plain" });
    if (window.navigator.msSaveBlob) { //For IE10
        window.navigator.msSaveBlob(blob, title);
        // [J]msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        window.navigator.msSaveOrOpenBlob(blob, text);
    } else if (document.getElementById(placedID) != null) { //For others
        document.getElementById(placedID).href = window.URL.createObjectURL(blob);
    }
};

/**
 * タグのステータスを取得する
 * @param {string} obj タグのオブジェクト（自己参照ならばthis）
 * @param {string} type 取得したい属性
 * @param {string} placedID リンクタグのID
 */
function getStatus(obj, type) {
    var status = obj.getAttribute('title');
    return status;
}

/**
 * [J]
 * フォーム入力情報を取得する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス
 *	@return isSuccess 正しい処理がなされたかどうかを返す。(true:正常終了/false:異常終了)
 */
readUserForm = function(designCRISPITChInstamce) {
    var isSuccess = false;
    //[J]submitされたデータを格納
    var inputUserSeqData = document.getElementById("inputFASTA").value;
    var inputUserInsert = document.getElementById("inputInsert").value;
    //[J]タイトルとシーケンス
    var extractedSequence = null;
    var readFirstLine = inputUserSeqData.match(/^.{1,15000}/)[0];
    if (readFirstLine.search(/>/) != -1) { //>があればタイトル登録
        designCRISPITChInstamce.setData(readFirstLine.replace(/^>/, ""), "title");
        extractedSequence = inputUserSeqData.replace(/^.{1,15000}/, "");
    } else { //>がなければタイトルは未登録 "no_title"とする
        extractedSequence = inputUserSeqData;
    }
    //[J]ユーザーが定義した挿入配列
    var insertSequence = null;
    var readFirstLine = inputUserInsert.match(/^.{1,15000}/)[0];
    if (readFirstLine.search(/>/) != -1) { //>があればタイトル登録
        insertSequence = inputUserInsert.replace(/^.{1,15000}/, "");
    } else { //>がなければタイトルは未登録 "no_title"とする
        insertSequence = inputUserInsert;
    }

    try {
        /////[E]Clear Error message/////
        document.getElementById("inputSeqError").innerHTML = "";
        document.getElementById("inputLMHError").innerHTML = "";
        document.getElementById("inputRMHError").innerHTML = "";
        document.getElementById("inputInsertError").innerHTML = "";

        /////[E]Sequence
        if ((extractedSequence.length < 100) || (extractedSequence.length > 15000)) {
            throw new Error("Error!!! The expected length of your sequence is 100-15,000[bp]");
        }
        var upSeq = extractedSequence.toUpperCase();
        designCRISPITChInstamce.setData(upSeq.replace(/\s{1,100}/g, ""), "sequence");
        document.getElementById("inputFASTA").disabled = "true"; // 入力不可


        //[E]ReadingFrame
        if (document.getElementById("selectFrame").value == "noframe") {
            bePITChDesigner.setStatus(true, "noframe");
            designCRISPITChInstamce.setMethod("direct", "MHMethod"); //[E]ReadingFrame=0 is default:
        } else {
            bePITChDesigner.setStatus(false, "noframe");
            designCRISPITChInstamce.setData(document.getElementById("selectFrame").value, "shiftedFrameNum");
        }

        if (designCRISPITChInstamce.getMethod("MHMethod") !== "direct") {
            //[E]Microhomology arms Design methods
            designCRISPITChInstamce.setMethod(document.getElementById("selectMHMethods").value, "MHMethod");
        }

        //[E]knockin targeting vectors
        designCRISPITChInstamce.setMethod(document.getElementById("selectKIvectors").value, "PrimerType");

        if (designCRISPITChInstamce.getMethod("PrimerType") === "UserSet") {
            /////[E]inisert sequence
            if ((insertSequence.length < 20) || (insertSequence.length > 15000)) {
                throw new Error("Error!!! The expected length of your insert sequence is 20-15,000[bp]");
            }
            var upInsertSeq = insertSequence.toUpperCase();
            if (designCRISPITChInstamce.setData(upInsertSeq.replace(/\s{1,100}/g, ""), "userInsert") === false) {
                throw new Error("Error!!! Primers can't be designed in the insert sequence. Please change insert sequence.");
            } else {
                document.getElementById("inputInsert").disabled = "true"; // 入力不可
            }
        }

        //[E]the length of leftmicrohomology
        var LMH = Number(document.getElementById("LeftMHlen").value.replace(/\s{1,100}/g, ""));
        if ((LMH < 10) || (LMH > 40)) {
            throw new Error("Error!!! The expected length of Left microhomology arms is 10-40[bp]");
        }
        designCRISPITChInstamce.setMethod(LMH, "LeftMHlen");

        //[E]PAM
        var PAMseq = document.getElementById("pam").value.replace(/\s{1,100}/g, "").split("");
        console.log(PAMseq)
        if (PAMseq.join("") === "") {
            throw new Error("Error!!! The PAM sequences is required.");
        }
        designCRISPITChInstamce.setMethod(PAMseq, "PAM");

        //[E]the length of rightmicrohomology
        var RMH = Number(document.getElementById("RightMHlen").value.replace(/\s{1,100}/g, ""));
        if ((RMH < 10) || (RMH > 40)) {
            throw new Error("Error!!! The expected length of Right microhomology arms is 10-40[bp]");
        }
        designCRISPITChInstamce.setMethod(RMH, "RightMHlen");

        //[E]the species
        var species = String(document.getElementById("species").value);
        if (typeof species !== 'string') {
            throw new Error("Sorry... The species is no entry option.");
        }
        bePITChDesigner.setStatus(species, "species");

        //Advanced options
        //[E]primers for genotyping
        //Min Tm value of  primers for genotyping
        var GPTmMin = Number(document.getElementById("GPTmMin").value);
        if ((GPTmMin < 0) || (GPTmMin > 100)) {
            throw new Error("Error!!! The expected Tm value of  primers for genotyping is 0-100[℃]");
        }
        designCRISPITChInstamce.setOptions(GPTmMin, "GPTmMin");

        //Max Tm value of  primers for genotyping
        var GPTmMax = Number(document.getElementById("GPTmMax").value);
        if ((GPTmMax < 0) || (GPTmMax > 100)) {
            throw new Error("Error!!! The expected Tm value of  primers for genotyping is 0-100[℃]");
        } else if (GPTmMax < GPTmMin) {
            throw new Error("Error!!! The expected range of Tm value is wrong.");
        }
        designCRISPITChInstamce.setOptions(GPTmMax, "GPTmMax");
        //Min CG value of  primers for genotyping
        var GPCGMin = Number(document.getElementById("GPCGMin").value);
        if ((GPCGMin < 0) || (GPCGMin > 100)) {
            throw new Error("Error!!! The expected CG% of  primers for genotyping is 0-100[%]");
        }
        designCRISPITChInstamce.setOptions(GPCGMin, "GPCGMin");
        //Max CG value of  primers for genotyping
        var GPCGMax = Number(document.getElementById("GPCGMax").value);
        if ((GPCGMax < 0) || (GPCGMax > 100)) {
            throw new Error("Error!!! The expected Tm value of  primers for genotyping is 0-100[%]");
        } else if (GPCGMax < GPTmMin) {
            throw new Error("Error!!! The expected range of CG% is wrong.");
        }
        designCRISPITChInstamce.setOptions(GPCGMax, "GPCGMax");

        //エラー表示消去
        if (bePITChDesigner.getStatus("errorId") !== "") {
            document.getElementById(bePITChDesigner.getStatus("errorId")).innerHTML = "";
        }

        isSuccess = true;

    } catch (e) {
        var errorTagID = null;
        if (e.message == "Error!!! The expected length of your sequence is 100-15,000[bp]") {
            errorTagID = "inputSeqError";
        } else if (e.message == "Error!!! The expected length of Left microhomology arms is 10-40 [bp]") {
            errorTagID = "inputLMHError";
        } else if (e.message == "Error!!! The expected length of Right microhomology arms is 10-40 [bp]") {
            errorTagID = "inputRMHError";
        } else if (e.message == "Error!!! The expected length of your insert sequence is 20-15,000[bp]") {
            errorTagID = "inputInsertError";
        } else if (e.messsage == "Error!!! Primers can't be designed in the insert sequence. Please change insert sequence.") {
            errorTagID = "inputInsertError";
        } else if (e.messsage == "Error!!! The PAM sequences is required.") {
            errorTagID = "inputPAMError";
        } else { //addvanced options error
            errorTagID = "AdOptionError";
        }
        //エラー表示
        document.getElementById(errorTagID).innerHTML = e.message;
        bePITChDesigner.setStatus(errorTagID, "errorId");
        //スクロールして移動
        scrollID("inputSeqError");

    } finally {
        return isSuccess;
    }
}


/**
 * [J]
 * htmlタグで色つけしたsgRNA配列データを生成する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス
 * @param	countDraft 候補セットの番号
 *	@return pushedgRNAArray htmlタグ付きsgRNA配列 (String global object)
 */
getHTMLgRNA = function(designCRISPITChInstamce, countDraft) {
    var gRNAArray = designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft);
    var pushedgRNAArray = "";
    if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) === "plus") {
        for (var countSeq = 0, len = gRNAArray.length - 3; countSeq < len; countSeq++) {
            pushedgRNAArray += gRNAArray[countSeq];
        }
        for (var countSeq = gRNAArray.length - 3, len = gRNAArray.length; countSeq < len; countSeq++) {
            pushedgRNAArray += "<span style='color:#ff0000;'>" + gRNAArray[countSeq] + "</span>";
        }
    } else if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) === "minus") {
        for (var countSeq = 0; countSeq < 3; countSeq++) {
            pushedgRNAArray += "<span style='color:#ff0000;'>" + gRNAArray[countSeq] + "</span>";
        }
        for (var countSeq = 3, len = gRNAArray.length; countSeq < len; countSeq++) {
            pushedgRNAArray += gRNAArray[countSeq];
        }
    }
    return pushedgRNAArray;
} ;

/**
 * [J]
 * IUBコードでのsgRNA配列データを生成する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス
 * @param	countDraft 候補セットの番号
 *@return pushedgRNAArray htmlタグ付きsgRNA配列 (String global object)
 */
getIUBgRNA = function(designCRISPITChInstamce, countDraft) {
    var gRNAArray = designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft);
    var PAMArray = designCRISPITChInstamce.getMethod("PAM");
    var revcompPAMArray = PAMArray.concat();
    revcompPAMArray.reverse();
    for (var i = 0; i < revcompPAMArray.length; i++) {
        if ((revcompPAMArray[i] === "A") || (revcompPAMArray[i] === "T") || (revcompPAMArray[i] === "C") || (revcompPAMArray[i] === "G")) {
            revcompPAMArray[i] = designCRISPITChInstamce.getCompBase(revcompPAMArray[i], "DNA");
        } else if (revcompPAMArray[i] === "N") {
            revcompPAMArray[i] = "N";
        } else if (revcompPAMArray[i] === "R") {
            revcompPAMArray[i] = "Y";
        } else if (revcompPAMArray[i] === "Y") {
            revcompPAMArray[i] = "R";
        } else if (revcompPAMArray[i] === "M") {
            revcompPAMArray[i] = "K";
        } else if (revcompPAMArray[i] === "K") {
            revcompPAMArray[i] = "M";
        } else if (revcompPAMArray[i] === "M") {
            revcompPAMArray[i] = "K";
        } else if (revcompPAMArray[i] === "S") {
            revcompPAMArray[i] = "S";
        } else if (revcompPAMArray[i] === "W") {
            revcompPAMArray[i] = "W";
        } else if (revcompPAMArray[i] === "H") {
            revcompPAMArray[i] = "D";
        } else if (revcompPAMArray[i] === "B") {
            revcompPAMArray[i] = "V";
        } else if (revcompPAMArray[i] === "V") {
            revcompPAMArray[i] = "B";
        } else if (revcompPAMArray[i] === "D") {
            revcompPAMArray[i] = "H";
        }
    }
    console.info("|||||||||||||" + revcompPAMArray.join(""));
    var pushedgRNAArray = "";
    if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) === "plus") {
        for (var countSeq = 0, len = gRNAArray.length - PAMArray.length; countSeq < len; countSeq++) {
            pushedgRNAArray += gRNAArray[countSeq];
        }
        for (var countSeq = gRNAArray.length - PAMArray.length, len = gRNAArray.length; countSeq < len; countSeq++) {
            console.log(PAMArray[countSeq - (gRNAArray.length - PAMArray.length)])
            pushedgRNAArray += PAMArray[countSeq - (gRNAArray.length - PAMArray.length)];
        }
    } else if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) === "minus") {
        for (var countSeq = 0; countSeq < revcompPAMArray.length; countSeq++) {
            pushedgRNAArray += revcompPAMArray[countSeq];
        }
        for (var countSeq = revcompPAMArray.length, len = gRNAArray.length; countSeq < len; countSeq++) {
            pushedgRNAArray += gRNAArray[countSeq];
        }
    }
    return pushedgRNAArray;
}

////////////////////////////PITCh design////////////////////////////////////////



/**
 * [J]
 * 入力されたポイントでknockin配列が作成可能か調べる
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス, 配列情報が入力されていなければならない
 * @param	targetBase knockin配列作成ポイント (0 <= x < designCRISPITChInstamce.inputSeqArray.length)
 * @return	isSuccess	作成可能かどうか(boolean value)
 */
canDesign = function(designCRISPITChInstamce, targetBase) {
    var isSuccess = false;
    //Some console function changed to null function temporarily.
    var stockedLog = window.console.log
    var stockedWarn = window.console.warn
    var stockedError = window.console.error
    var stockedInfo = window.console.info
    window.console.log = function(i) { return; };
    window.console.warn = function(i) { return; };
    window.console.error = function(i) { return; };
    window.console.info = function(i) { return; };
    //配列設計を一つだけ行うことを施行
    designCRISPITChInstamce.setData(targetBase, "targetedPos");
    if (designCRISPITChInstamce.createDesign(1) == true) {
        var isSuccess = true;
    }
    //設計情報はクリア
    designCRISPITChInstamce.clearDesign();
    window.console.log = stockedLog;
    window.console.warn = stockedWarn;
    window.console.error = stockedError;
    window.console.info = stockedInfo;
    console.info("[Check] canDesign(...," + targetBase + ") judge : " + isSuccess)

    return (isSuccess);
}

/////////////////////////////////canvas////////////////////////////////////////



/**
 *	[E]
 *	drowing multi-line using HTML5 Canvas
 *	@param	context current context(canvas 2d context)
 *	@param	text full text including '\n' (String global object)
 *	@param	x The x coordinate where to start painting the text (relative to the canvas)
 *	@param	y	The y coordinate where to start painting the text (relative to the canvas)
 * [J]
 * 改行(\n)ありのテキストをcanvas上に描写する
 *	@param	context 現在のコンテキスト(canvas 2d context)
 *	@param	text 描写するテキスト (String global object)
 *	@param	x 描写するcanvas上のポイントのx座標
 *	@param	y 描写するcanvas上のポイントのy座標
 */
var fillMultiLine = function(context, text, x, y) {
    var textList = text.split('\n');
    var lineHeight = context.measureText("A").width;
    textList.forEach(function(text, i) {
        context.fillText(text, x, y + lineHeight * i);
    });
};

/**
 * [E]
 * drowing Quadrangle using HTML5 Canvas
 * @param	coordinate1 first stroke starting coordinate data (Array global object, [0]:xaxis [1]:yaxis)
 * @param	coordinate2 second stroke starting coordinate data (Array global object, [0]:xaxis [1]:yaxis)
 * @param	coordinate3 third stroke starting coordinate data (Array global object, [0]:xaxis [1]:yaxis)
 *	@param	coordinate4 last stroke starting coordinate data (Array global object, [0]:xaxis [1]:yaxis)
 *	@param	context current context(canvas 2d context)
 *	@param	filledColer color to use inside shapes (String global object)
 *	@param	globalAlpha the alpha value that is applied to shapes (0-1)
 * [J]
 * 四角形を描写する
 * @param	coordinate1 ストローク開始座標 [0]:xaxis [1]:yaxis (Array global object)
 * @param	coordinate2 ストローク第二座標 [0]:xaxis [1]:yaxis (Array global object)
 * @param	coordinate3 ストローク第三座標 [0]:xaxis [1]:yaxis (Array global object)
 *	@param	coordinate4 ストローク最終座標 [0]:xaxis [1]:yaxis (Array global object)
 *	@param	context 現在のコンテキスト(canvas 2d context)
 *	@param	filledColer 塗りつぶし色の指定 (String global object)
 *	@param	globalAlpha 塗りつぶし色の透明度の指定 (0-1)
 */
drowQuadrangle = function(coordinate1, coordinate2, coordinate3, coordinate4, context, filledColer, globalAlpha) {
    context.save();

    context.beginPath();
    context.moveTo(coordinate1[0], coordinate1[1]);
    context.lineTo(coordinate2[0], coordinate2[1]);
    context.lineTo(coordinate3[0], coordinate3[1]);
    context.lineTo(coordinate4[0], coordinate4[1]);
    context.closePath();
    context.globalAlpha = 0; //edgeless
    context.stroke();
    context.globalAlpha = globalAlpha;
    context.fillStyle = filledColer;
    context.fill();

    context.restore();
}

/**
 * [J]
 * canvasのjpeg画像を作成する
 *	@param	canvasID 画像化するcanvasのID (String global object)
 * @param	targetID 画像化したcanvasのリンク先ID (String global object)
 * @param	tagtype リンクされるタグの種類 ("a" or "img")
 */
var makeJPEG = function(canvasID, targetID, tagtype) {
    if ((document.getElementById(canvasID) != null) && (document.getElementById(targetID) != null)) {
        var makeJPEGURL = document.getElementById(canvasID).toDataURL("image/jpeg");
        try {
            if (tagtype == "a") {
                document.getElementById(targetID).href = makeJPEGURL;
                document.getElementById(targetID).title = canvasID;
                document.getElementById(targetID).download = canvasID;
            } else if (tagtype == "img") {
                document.getElementById(targetID).src = makeJPEGURL;
                document.getElementById(targetID).title = canvasID;
            } else {
                throw new Error("Undefined tagtype:" + tagtype);
            }
        } catch (e) {
            console.error(e);
        }
    }
}



/**
 * [J]
 * KnockInイメージ配列を<canvas id='KIimage"+(countDraft+1)'></canvas>上に描写する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス, すでにデザイン済みでなければならない
 * @param	countDraft 設計候補の番号
 */
var drawCanvasKIimage = function(designCRISPITChInstamce, countDraft) {
    var canvas = document.getElementById("KIimage" + (countDraft + 1));
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "black";
        context.font = "12px 'Times New Roman'";
        context.textAlign = "center";
        context.textBaseline = "top";
    }
    ////[E]background color/////////////////////////////////////////////////////////
    drowQuadrangle([0, 0], [0, canvas.height], [canvas.width, canvas.height], [canvas.width, 0], context, 'rgb(256, 256, 256)', 1);
    ////[E]Targeted allele and peptide//////////////////////////////////////////////
    var targetedSeq = designCRISPITChInstamce.retrieveDesign("Seq", countDraft);
    //targetedSeq[countSeq]からプッシュされ、length:3になったらコドン変換される配列(length:0-3)
    var pushedCodon = "";
    //トリプレットとアミノ酸の複数行文字列、実際にはこれが描写される
    var outedCodon = "";
    for (var countSeq = 0, len = (designCRISPITChInstamce.retrieveData("targetedPos") - 48 - designCRISPITChInstamce.retrieveData("remainedBaseNum") + 96); countSeq < len; countSeq++) {
        //[J]3'末端は塩基が"undefined"となりうるためコドン認識が行える文字列のみ描写する
        if ((countSeq % 3 == 0) && (designCRISPITChInstamce.convertCodon(pushedCodon) !== '---')) {
            outedCodon += pushedCodon;
            outedCodon += "\n";
            //frame mode
            if (!bePITChDesigner.getStatus("noframe")) {
                outedCodon += designCRISPITChInstamce.convertCodon(pushedCodon);
            }
            fillMultiLine(context, outedCodon, 5 + countSeq * 9, 65);
            pushedCodon = "";
            outedCodon = "";
        }
        pushedCodon += targetedSeq[countSeq];
    }
    fillMultiLine(context, "Sequence", 30, 40);

    ////[E]LeftMH///////////////////////////////////////////////////////////////////
    context.textAlign = "left";
    fillMultiLine(context, designCRISPITChInstamce.retrieveDesign("LeftMHarray", countDraft).join(''), 35, 230);
    fillMultiLine(context, "Left microhomology", 10, 250);
    ////[E]RightMH//////////////////////////////////////////////////////////////////
    context.textAlign = "right";
    fillMultiLine(context, designCRISPITChInstamce.retrieveDesign("RightMHarray", countDraft).join(''), 814, 230);
    fillMultiLine(context, "Right microhomology", 890, 250);
    ////[E]GOI junction/////////////////////////////////////////////////////////////
    context.textAlign = "center";
    for (var pointedX = 35 + 8.5 * (designCRISPITChInstamce.getMethod("LeftMHlen") + 4); pointedX < 400; pointedX += 8.5) {
        fillMultiLine(context, "-", pointedX, 230);
    };
    context.save();
    context.fillStyle = "blue";
    fillMultiLine(context, "GOI", 424, 230);
    context.restore();
    for (var pointedX = 448, len = 820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen") - 34; pointedX < len; pointedX += 8.5) {
        fillMultiLine(context, "-", pointedX, 230);
    };
    ////[E]knock-in allele and peptide//////////////////////////////////////////////
    context.textAlign = "center";
    context.textBaseline = "center";
    outedCodon = "";
    pushedCodon = "";
    for (var countSeq = 0, len = (designCRISPITChInstamce.retrieveData("targetedPos") - 48 - designCRISPITChInstamce.retrieveData("remainedBaseNum") + 96); countSeq < len; countSeq++) {
        //[J]3'末端は塩基が"undefined"となりうるためコドン認識が行える文字列のみ描写する
        if ((countSeq % 3 == 0) && (designCRISPITChInstamce.convertCodon(pushedCodon) !== '---')) {
            outedCodon += pushedCodon;
            outedCodon += "\n";
            if (bePITChDesigner.getStatus("noframe")) { //フレームなし
                if (countSeq < 51) {
                    fillMultiLine(context, outedCodon, countSeq * 9 - 8, 395);
                } else if (countSeq == 51) {
                    if (designCRISPITChInstamce.getMethod("MHMethod") === "direct") {
                        context.save();
                        context.fillStyle = "blue";
                        fillMultiLine(context, 'GOI', countSeq * 9 - 8, 395);
                        context.restore();
                    }
                } else if (countSeq > 51) {
                    if (designCRISPITChInstamce.getMethod("MHMethod") === "direct") {
                        fillMultiLine(context, outedCodon, 27 + (countSeq - 3) * 9 - 8, 395);
                    }
                }
            } else { //フレームあり
                outedCodon += designCRISPITChInstamce.convertCodon(pushedCodon);
                if (countSeq < 51) {
                    fillMultiLine(context, outedCodon, countSeq * 9 - 8, 395);
                } else if (countSeq == 51) {
                    if (designCRISPITChInstamce.getMethod("MHMethod") === "codon-deletion") {
                        context.save();
                        context.fillStyle = "blue";
                        fillMultiLine(context, 'GOI', countSeq * 9 - 8, 395);
                        context.restore();
                    } else if (designCRISPITChInstamce.getMethod("MHMethod") === "C-insertion") {
                        pushedCodon = pushedCodon.slice(0, designCRISPITChInstamce.retrieveData("remainedBaseNum"));
                        for (var replacedPoint = designCRISPITChInstamce.retrieveData("remainedBaseNum"); replacedPoint < 3; replacedPoint++) {
                            pushedCodon += "C";
                        }
                        outedCodon = pushedCodon;
                        outedCodon += "\n";
                        outedCodon += designCRISPITChInstamce.convertCodon(pushedCodon);
                        fillMultiLine(context, outedCodon, countSeq * 9 - 8, 395);
                        context.save();
                        context.fillStyle = "blue";
                        fillMultiLine(context, 'GOI', (countSeq + 3) * 9 - 8, 395);
                        context.restore();
                    }
                } else if (countSeq > 51) {
                    if (designCRISPITChInstamce.getMethod("MHMethod") === "codon-deletion") {
                        fillMultiLine(context, outedCodon, 27 + (countSeq - 3) * 9 - 8, 395);
                    } else if (designCRISPITChInstamce.getMethod("MHMethod") === "C-insertion") {
                        fillMultiLine(context, outedCodon, 27 + countSeq * 9 - 8, 395);
                    }
                }
            }
            pushedCodon = "";
            outedCodon = "";
        }
        pushedCodon += targetedSeq[countSeq];
    }
    fillMultiLine(context, "Knock-in sequence", 60, 370);
    ////[E]sgRNA/////////////////////////////////////////////////////////////////////
    var pushedgRNABase = "";
    if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) == "plus") {
        var endedgRNA = designCRISPITChInstamce.retrieveDesign("PAMendPos", countDraft) - (designCRISPITChInstamce.retrieveData("targetedPos") - 48 - designCRISPITChInstamce.retrieveData("remainedBaseNum"));
        context.textAlign = "right";
        for (var countgRNABase = 0; countgRNABase < 23; countgRNABase++) {
            pushedgRNABase = designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft)[22 - countgRNABase]
            if (countgRNABase < 3) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "black";
            }
            fillMultiLine(context, pushedgRNABase, 27 + (endedgRNA - countgRNABase) * 9, 30);
        }
        context.fillStyle = "black";
        fillMultiLine(context, "Gene-specific sgRNA", 520, 10);
    } else if (designCRISPITChInstamce.retrieveDesign("Direction", countDraft) == "minus") {
        var endedgRNA = designCRISPITChInstamce.retrieveDesign("PAMendPos", countDraft) - (designCRISPITChInstamce.retrieveData("targetedPos") - 48 - designCRISPITChInstamce.retrieveData("remainedBaseNum"));
        context.textAlign = "left";
        var targetedgRNA = designCRISPITChInstamce.retrieveData("targetedPos") - (designCRISPITChInstamce.retrieveData("targetedPos") - 48 - designCRISPITChInstamce.retrieveData("remainedBaseNum"));
        for (var countgRNABase = 0; countgRNABase < 23; countgRNABase++) {
            pushedgRNABase = designCRISPITChInstamce.retrieveDesign("gRNAbindingarray", countDraft)[countgRNABase]
            if (countgRNABase < 3) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "black";
            }
            fillMultiLine(context, pushedgRNABase, 19 + (endedgRNA + countgRNABase) * 9, 112);
        }
        context.fillStyle = "black";
        fillMultiLine(context, "Gene-specific sgRNA", 380, 127);
    }

    ////[E]Quadrangle///////////////////////////////////////////////////////////////
    if (designCRISPITChInstamce.getMethod("MHMethod") === "codon-deletion") {
        //[E]donor_leftMH
        drowQuadrangle(
            [35, 245], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 245], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 230], [35, 230], context, 'rgb(200, 0, 0)', 0.3);
        //[E]allele_leftMH
        drowQuadrangle(
            [17 + 48 * 9 + 2, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 80], [17 + 48 * 9 + 2, 80], context, 'rgb(200, 0, 0)', 0.3);
        //[E]leftMH_junction
        drowQuadrangle(
            [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 65], [35, 230], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 245], [17 + 48 * 9 + 2, 80], context, 'rgb(200, 0, 0)', 0.1);
    } else if (designCRISPITChInstamce.getMethod("MHMethod") === "C-insertion") {
        //[E]donor_leftMH
        drowQuadrangle(
            [35, 245], [35 + 8.5 * (designCRISPITChInstamce.getMethod("LeftMHlen") - 1), 245], [35 + 8.5 * (designCRISPITChInstamce.getMethod("LeftMHlen") - 1), 230], [35, 230], context, 'rgb(200, 0, 0)', 0.3);
        //[E]allele_leftMH
        drowQuadrangle(
            [17 + (48 + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen") + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9 - 1, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen") + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9 - 1, 80], [17 + (48 + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9, 80], context, 'rgb(200, 0, 0)', 0.3);
        //[E]leftMH_junction
        drowQuadrangle(
            [17 + (48 + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9, 80], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen") + designCRISPITChInstamce.retrieveData("remainedBaseNum")) * 9 - 1, 65], [35, 230], [35 + 8.5 * (designCRISPITChInstamce.getMethod("LeftMHlen") - 1), 245], context, 'rgb(200, 0, 0)', 0.1);
    } else if (designCRISPITChInstamce.getMethod("MHMethod") === "direct") {
        //[E]donor_leftMH
        drowQuadrangle(
            [35, 245], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 245], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 230], [35, 230], context, 'rgb(200, 0, 0)', 0.3);
        //[E]allele_leftMH
        drowQuadrangle(
            [17 + 48 * 9 + 2, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 65], [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 80], [17 + 48 * 9 + 2, 80], context, 'rgb(200, 0, 0)', 0.3);
        //[E]leftMH_junction
        drowQuadrangle(
            [17 + (48 - designCRISPITChInstamce.getMethod("LeftMHlen")) * 9 - 1, 65], [35, 230], [35 + 8.5 * designCRISPITChInstamce.getMethod("LeftMHlen"), 245], [17 + 48 * 9 + 2, 80], context, 'rgb(200, 0, 0)', 0.1);
    }

    if (designCRISPITChInstamce.getMethod("MHMethod") === "direct") {
        //[E]donor_rightMH
        drowQuadrangle(
            [820, 230], [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 230], [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 245], [820, 245], context, 'rgb(0, 0, 200)', 0.3);
        //[E]allele_rightMH
        drowQuadrangle(
            [891 - 49 * 9, 65], [891 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 65], [891 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 80], [891 - 49 * 9, 80], context, 'rgb(0, 0, 200)', 0.3);
        //[E]rightMH_junction
        drowQuadrangle(
            [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 245], [820, 230], [891 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 65], [891 - 49 * 9, 80], context, 'rgb(0, 0, 200)', 0.1);
    } else if (designCRISPITChInstamce.getMethod("MHMethod") !== "direct") {
        //[E]donor_rightMH
        drowQuadrangle(
            [820, 230], [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 230], [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 245], [820, 245], context, 'rgb(0, 0, 200)', 0.3);
        //[E]allele_rightMH
        drowQuadrangle(
            [915 - 49 * 9, 65], [915 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 65], [915 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 80], [915 - 49 * 9, 80], context, 'rgb(0, 0, 200)', 0.3);
        //[E]rightMH_junction
        drowQuadrangle(
            [820 - 9 * designCRISPITChInstamce.getMethod("RightMHlen"), 245], [820, 230], [915 - (48.5 - designCRISPITChInstamce.getMethod("RightMHlen")) * 9, 65], [915 - 49 * 9, 80], context, 'rgb(0, 0, 200)', 0.1);
    }
}



/**
 * [J]
 * TAベクター5'側配列を<canvas id='5Vectorimage"+(countDraft+1)'></canvas>上に描写する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス, すでにデザイン済みでなければならない
 * @param	countDraft 設計候補の番号
 */
var drowCanvas5TAVector = function(designCRISPITChInstamce, countDraft) {
    var canvas = document.getElementById("5Vectorimage" + (countDraft + 1));
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "black";
        context.font = "12px 'Times New Roman'";
        context.textAlign = "center";
        context.textBaseline = "top";
    }
    //background color
    drowQuadrangle([0, 0], [0, canvas.height], [canvas.width, canvas.height], [canvas.width, 0], context, 'rgb(256, 256, 256)', 1);
    //[E]The 5'-end sequence of Knock-in Targeting vector5TAVector and primers
    var targetedSeq = designCRISPITChInstamce.retrieveDesign("5vector", countDraft);
    var bindedFwdlen = designCRISPITChInstamce.retrieveDesign("5fwdprimer", countDraft).length;
    var bindedRevlen = designCRISPITChInstamce.retrieveDesign("5revprimer", countDraft).length;
    var initiatedXpos = 600 - targetedSeq.length / 2 * 9;
    fillMultiLine(context, "5' forward primer", 100, 30);
    fillMultiLine(context, "5'-end knock-in targeting vector", 100, 60);
    fillMultiLine(context, "5'-", initiatedXpos - 20, 90);
    fillMultiLine(context, "-3'", initiatedXpos + targetedSeq.length * 9 + 20, 90);
    fillMultiLine(context, "5' reverse primer", 100, 140);
    var outedSeq = null;
    for (var countSeq = 0, len = targetedSeq.length; countSeq < len; countSeq++) {

        //forward primer
        if ((((targetedSeq.length - 1) - countSeq) === 2 + bindedFwdlen) || (countSeq === (2 + bindedRevlen))) {
            outedSeq = targetedSeq[countSeq] + "\n|\n|\n|\n|\n";
        } else if ((((targetedSeq.length) - countSeq) > 3) && (((targetedSeq.length - 1) - countSeq) < 2 + bindedFwdlen)) {
            outedSeq = targetedSeq[countSeq] + "\n\n\n\n\n";
        } else {
            outedSeq = " \n\n\n\n\n";
        }

        //complete sequence
        outedSeq += targetedSeq[countSeq];
        outedSeq += "\n";
        outedSeq += "|";
        outedSeq += "\n";
        outedSeq += designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");

        //reverse primer
        if ((((targetedSeq.length - 1) - countSeq) === 2 + bindedFwdlen) || (countSeq === (2 + bindedRevlen))) {
            outedSeq += "\n|\n|\n|\n|\n|\n" + designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");
        } else if ((countSeq > 2) && (countSeq < 3 + bindedRevlen)) {
            outedSeq += "\n\n\n\n\n\n" + designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");
        } else {
            outedSeq += "\n\n\n\n\n\n ";
        }

        //coloring
        if (designCRISPITChInstamce.getMethod("PrimerType") == "EGFP2APuroR") {
            if ((countSeq > 29) && (countSeq < 53)) {
                //sgRNA
                context.fillStyle = "darkorchid";
            } else if ((countSeq >= 53) && (countSeq < 53 + designCRISPITChInstamce.retrieveDesign("LeftMHarray", countDraft).length)) {
                //left microhomology
                context.fillStyle = "red";
            }
        } else if (designCRISPITChInstamce.getMethod("PrimerType") == "CMV-EGFP2APuroR") {
            if ((countSeq > 12) && (countSeq < 36)) {
                //sgRNA
                context.fillStyle = "darkorchid";
            } else if ((countSeq >= 36) && (countSeq < 36 + designCRISPITChInstamce.retrieveDesign("LeftMHarray", countDraft).length)) {
                //left microhomology
                context.fillStyle = "red";
            }
        }
        //一列ずつ描写
        fillMultiLine(context, outedSeq, initiatedXpos + countSeq * 9, 40);
        context.fillStyle = "black";
    }
};



/**
 * [J]
 * TAベクター3'側配列を<canvas id='3Vectorimage"+(countDraft+1)'></canvas>上に描写する
 * @param	designCRISPITChInstamce designCRISPITChクラスのインスタンス, すでにデザイン済みでなければならない
 * @param	countDraft 設計候補の番号
 */
var drowCanvas3TAVector = function(designCRISPITChInstamce, countDraft) {
    var canvas = document.getElementById("3Vectorimage" + (countDraft + 1));
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "black";
        context.font = "12px 'Times New Roman'";
        context.textAlign = "center";
        context.textBaseline = "top";
    }
    //background color
    drowQuadrangle([0, 0], [0, canvas.height], [canvas.width, canvas.height], [canvas.width, 0], context, 'rgb(256, 256, 256)', 1);
    //[E]The 3'-end sequence of Knock-in Targeting vector3TAVector and primers
    var targetedSeq = designCRISPITChInstamce.retrieveDesign("3vector", countDraft);
    var bindedFwdlen = designCRISPITChInstamce.retrieveDesign("3fwdprimer", countDraft).length;
    var bindedRevlen = designCRISPITChInstamce.retrieveDesign("3revprimer", countDraft).length;
    var initiatedXpos = 600 - targetedSeq.length / 2 * 9;
    fillMultiLine(context, "3' forward primer", 100, 30);
    fillMultiLine(context, "3'-end knock-in targeting vector", 100, 60);
    fillMultiLine(context, "5'-", initiatedXpos - 20, 90);
    fillMultiLine(context, "-3'", initiatedXpos + targetedSeq.length * 9 + 20, 90);
    fillMultiLine(context, "3' reverse primer", 100, 140);
    var outedSeq = null;
    for (var countSeq = 0, len = targetedSeq.length; countSeq < len; countSeq++) {
        //forward primer
        if ((((targetedSeq.length - 1) - countSeq) === 2 + bindedFwdlen) || (countSeq === (2 + bindedRevlen))) {
            outedSeq = targetedSeq[countSeq] + "\n|\n|\n|\n|\n";
        } else if ((((targetedSeq.length) - countSeq) > 3) && (((targetedSeq.length - 1) - countSeq) < 2 + bindedFwdlen)) {
            outedSeq = targetedSeq[countSeq] + "\n\n\n\n\n";
        } else {
            outedSeq = " \n\n\n\n\n";
        }
        //complete sequence
        outedSeq += targetedSeq[countSeq];
        outedSeq += "\n";
        outedSeq += "|";
        outedSeq += "\n";
        outedSeq += designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");
        //reverse primer
        if ((((targetedSeq.length - 1) - countSeq) === 2 + bindedFwdlen) || (countSeq === (2 + bindedRevlen))) {
            outedSeq += "\n|\n|\n|\n|\n|\n" + designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");
        } else if ((countSeq > 2) && (countSeq < 3 + bindedRevlen)) {
            outedSeq += "\n\n\n\n\n\n" + designCRISPITChInstamce.getCompBase(targetedSeq[countSeq], "DNA");
        } else {
            outedSeq += "\n\n\n\n\n\n ";
        }

        if (designCRISPITChInstamce.getMethod("PrimerType") == "EGFP2APuroR") {
            if ((countSeq > targetedSeq.length - 36) && (countSeq < targetedSeq.length - 12)) {
                //sgRNA
                context.fillStyle = "darkorchid";
            } else if ((countSeq <= targetedSeq.length - 36) && (countSeq > targetedSeq.length - 36 - designCRISPITChInstamce.retrieveDesign("RightMHarray", countDraft).length)) {
                //left microhomology
                context.fillStyle = "blue";
            }
        } else if (designCRISPITChInstamce.getMethod("PrimerType") == "CMV-EGFP2APuroR") {
            if ((countSeq > targetedSeq.length - 61) && (countSeq < targetedSeq.length - 37)) {
                //sgRNA
                context.fillStyle = "darkorchid";
            } else if ((countSeq <= targetedSeq.length - 61) && (countSeq > targetedSeq.length - 61 - designCRISPITChInstamce.retrieveDesign("RightMHarray", countDraft).length)) {
                //right microhomology
                context.fillStyle = "blue";
            }
        }
        fillMultiLine(context, outedSeq, initiatedXpos + countSeq * 9, 40);
        context.fillStyle = "black";
    }
};


/////////////////////////////main stream///////////////////////////////////////


//[J]knockin処理を保存インスタンス
//var submitedSequence = new designCRISPITCh();
var submitedSequence = new PITChdesigner();
//評価関数をセット
submitedSequence.setData(selPrimer, "evalPrimerFunc")
    //[J]ページの表示状態を保存インスタンス
var bePITChDesigner = new controlMainStatus();
//[J]Summaryを保存インスタンス
var handledRESULT = new makeSummary(submitedSequence);
//[J]genotypingプライマー情報描写用インスタンス
var genotypingprimerviewer;
//[J]プロトコールのPDF作成用インスタンス
var protocolpdf = new writeProtocol();


/**
 * [J]
 * 入力された情報を登録してボタン表示させる
 * @param	flagInput 登録開始のフラグ (boolean value)
 * @return	正しい処理がなされたかどうか(0:正常終了/1:異常終了)
 *
 * The HTML Hierarchy
 *<---------row group---------->
 * <--------codon group-------->
 *  <count><input buttom><codon>
 */
inputFormData = function(flagInput) {
    if (flagInput == true) {
        //[J]入力と設定のチェックを行い、よければボタンを生成する。
        if ((readUserForm(submitedSequence) == true) && (submitedSequence.hasMethod() == true)) { //Checking input data.
            //[J]塩基ボタン生成
            //[J]html格納変数
            var madeButtoms = "<br><h3>2. Select the target position</h3><br>";
            //[J]submitされた配列を格納
            var inputSeqArray = submitedSequence.retrieveData("sequencearray");
            //[J]フレーム開始地点からの番号
            var readFrameIndex = 0;
            //[J]コドン格納変数
            var pushedCodon = null;

            //[J]ボタン生成のためのhtml文字列を作成
            var mapBaseColor = {
                'A': 'btn btn-success btn-sm',
                'T': 'btn btn-danger btn-sm',
                'C': 'btn btn-warning btn-sm',
                'G': 'btn btn-primary btn-sm',
                'side': 'btn btn-default',
                'impossible': 'btn btn-info'
            }
            for (var countedBase = 0, len = inputSeqArray.length; countedBase < len; countedBase++) {

                //[J]フレームの設定
                if (countedBase < submitedSequence.retrieveData("shiftedFrameNum")) {
                    //[J]フレーム外
                    madeButtoms += "<br>" + (countedBase - submitedSequence.retrieveData("shiftedFrameNum")) + "<br>"

                } else if (countedBase == submitedSequence.retrieveData("shiftedFrameNum")) {
                    //[J]フレーム開始
                    madeButtoms += "<br>"
                        //<row group> starting
                        +
                        "<div>"
                        //<codon group> starting
                        +
                        "<div class='btn-group' id='codongroup' role='group'>"
                        //<count> starting
                        +
                        "<div>" +
                        "<br>" + (readFrameIndex + 1)
                        //<count> ending
                        +
                        "</div>";
                    pushedCodon = "";

                } else if (countedBase > submitedSequence.retrieveData("shiftedFrameNum")) {
                    //[J]フレーム内
                    readFrameIndex++;
                    //[J]3bpごとにコドン判定&初期化
                    if (readFrameIndex % 3 === 0) {
                        madeButtoms += "<br>"
                            //<codon> starting
                            +
                            "<div class='alert alert-success' role='alert'>"

                        //コドン表示（noframeの場合はスルー）
                        //30bpごとに改行
                        if (readFrameIndex % 30 === 0) {
                            if (!(bePITChDesigner.getStatus("noframe"))) {
                                madeButtoms += submitedSequence.convertCodon(pushedCodon);
                            }
                            madeButtoms += ""
                                //<codon> ending
                                +
                                "</div>"
                                //<codon group> ending
                                +
                                "</div>"
                                //<row group> ending
                                +
                                "<div>";
                        } else {
                            if (!(bePITChDesigner.getStatus("noframe"))) {
                                madeButtoms += submitedSequence.convertCodon(pushedCodon);
                            }
                            madeButtoms += ""
                                //<codon> ending
                                +
                                "</div>"
                                //<codon group> ending
                                +
                                "</div>";
                        }

                        //次のコドングループを開始、フレームにあわせた塩基番号を出力
                        madeButtoms += ""
                            //<codon group> starting
                            +
                            "<div class='btn-group' role='group'>"
                            //<count> starting
                            +
                            "<div>" +
                            "<br>" + (readFrameIndex + 1) +
                            "</div>"
                        pushedCodon = "";
                    }
                }

                //[J]塩基ごとにボタンの色を分ける。
                var shownBase = inputSeqArray[countedBase];
                madeButtoms += ""
                    //<input buttom>
                    +
                    "<input type=submit id='basebuttom' ";
                if ((countedBase < 48) || (countedBase > (submitedSequence.retrieveData("inputTotalLen") - 49))) {
                    //[J]ビジュアライズができないため±48bpは選択させない。
                    madeButtoms += "class='" + mapBaseColor['side'] + "' disabled='disabled'"
                } else if (!(canDesign(submitedSequence, countedBase))) {
                    //[J]デザインできない領域も選択させない。
                    madeButtoms += "class='" + mapBaseColor['impossible'] + "' disabled='disabled'"
                        //[J]デザイン可能
                } else {
                    madeButtoms += "class='" + mapBaseColor[shownBase] + "'"
                }
                madeButtoms += " value=" + shownBase + "	onclick='designKnockInSeq(" + countedBase + ")' style='WIDTH: 35px; HEIGHT: 35spx;'>";
                pushedCodon += shownBase;
            }

            //[J]形式上あまりの塩基配列をconvertしておく
            madeButtoms += "<br>"
                //<codon> starting
                +
                "<div class='alert alert-success' role='alert'>";
            if (!bePITChDesigner.getStatus("noframe")) {
                madeButtoms += submitedSequence.convertCodon(pushedCodon);
            }
            //[E]END
            madeButtoms += ""
                //<codon> ending
                +
                "</div>"
                //<codon group> ending
                +
                "</div>"
                //<row group> ending
                +
                "</div>"

            document.getElementById("seq_image").innerHTML = madeButtoms;
            //スクロールして移動
            scrollID("seq_image");
            return 0;
        }
        return 1;
    }
}



/**
 * [J]
 * 指定したポイントでknockin配列を作成し、その結果を表示する。
 * @param	targetBase knockin配列作成ポイント (0 <= x < designCRISPITChInstamce.inputSeqArray.length)
 * @return	isSuccess 正しい処理がなされたかどうか(0:正常終了/1:異常終了)
 */
designKnockInSeq = function(targetBase) {
    var isSuccess = false;
    if (typeof targetBase !== "undefined") {
        //ノックインデザイン初期化
        submitedSequence.clearDesign();

        //プライマービュワーインスタンスを初期化
        if (typeof(genotypingprimerviewer) !== 'undefined') genotypingprimerviewer = {};

        //デザイン処理開始
        submitedSequence.setData(targetBase, "targetedPos");
        if (submitedSequence.createDesign() == true) { //[E]available to design

            //補足設計
            //genotyping 用プライマー設計
            submitedSequence.generateGPrimer();

            //プライマーリスト取得
            var pickedPrimer = {
                outerleft: submitedSequence.pickGPrimer("outerleft", 1),
                outerright: submitedSequence.pickGPrimer("outerright", 1),
                innerleft: submitedSequence.pickGPrimer("innerleft", 1),
                innerright: submitedSequence.pickGPrimer("innerright", 1)
            };


            var ispickedPrimer = {
                outerleft: "",
                outerright: "",
                innerleft: "",
                innerright: ""
            };
            if (pickedPrimer.outerleft[0].failure_cause !== "") ispickedPrimer.outerleft = "hidden";
            if (pickedPrimer.outerright[0].failure_cause !== "") ispickedPrimer.outerright = "hidden";
            if (pickedPrimer.innerleft[0].failure_cause !== "") ispickedPrimer.innerleft = "hidden";
            if (pickedPrimer.innerright[0].failure_cause !== "") ispickedPrimer.innerright = "hidden";

            //プロトコール作成用にデザイン読み込み
            protocolpdf.enterDesign(submitedSequence);

            //html出力
            //[E]The result is written on html.
            var madeDraft = "<h3>3. Result</h3>"
                //// Summary Modal /////////////////////////////////////////////////////////////
            handledRESULT.inputSummary(submitedSequence);
            madeDraft += "" +
                "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#Summarytxt'>" +
                "Download summary" +
                "</button>" +
                "<div class='modal fade bs-example-modal-lg' id='Summarytxt' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
                "<div class='modal-dialog modal-lg' role='document'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                "<h4 class='modal-title' id='myModalLabel'>Summary</h4>" +
                "</div>" +
                "<div class='modal-body'>" +
                "<div class='form-group'>" +
                "<label for='exampleTextarea'>Tab-delimited text <span style='color:#0000ff;'>(This can be copy-pasted into spreadsheet softwares (e.g. Microsoft Excel) or text editors.)</span></label>" +
                "<textarea class='form-control' id='Summary' name='Summary' rows='20' style='font-size:10px;' onclick='this.select(0,this.value.length)'>" + handledRESULT.getSummary() +
                "</textarea>" +
                "<a type='button' class='btn btn-primary' id='downloadcsv' href='#' download='" + submitedSequence.retrieveData('title') + ".csv' onclick='handledRESULT.downloadSummaryCSV(\"downloadcsv\")'>Download CSV file</a>" +
                "</div>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

            //// knockin image /////////////////////////////////////////////////////////////
            ////[J]デザインできたデータセットのイメージと詳細を表示する
            for (var countDraft = 0; submitedSequence.hasAllDesign(countDraft, []) == true; countDraft++) {
                madeDraft += "<hr>" +
                    "<div class='container'>" +
                    "<h4>No." + (countDraft + 1) + "</h4>" +
                    "<div class='row'>" +
                    "<a type='button' data-toggle='modal' data-target='#modalKIimage" + (countDraft + 1) + "' style='cursor:pointer;'>" +
                    "<canvas id='KIimage" + (countDraft + 1) + "' width=900 height=456></canvas>" +
                    "</a>" +
                    "<a id='convertedKIimagelink" + (countDraft + 1) + "' href='' target='_blank'>" +
                    "[ download ]" +
                    "</a>" +
                    "</div>"
                    //JPEG形式をmodalで表示
                    +
                    "<div class='modal fade bs-example-modal-lg' id='modalKIimage" + (countDraft + 1) + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
                    "<div class='modal-dialog modal-lg' role='document'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                    "<h4 class='modal-title' id='myModalLabel'>Knock-In image No." + (countDraft + 1) + "</h4>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<div class='form-group'>" +
                    "<img class='img-responsive' id='convertedKIimage" + (countDraft + 1) + "' name='Knock-In image No." + (countDraft + 1) + "' src=''>" +
                    "</div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"

                //// detail infomation ///////////////////////////////////////////////////////
                //詳細をcollapseで表示
                +
                "<button class='btn btn-success' type='button' data-toggle='collapse' data-target='#detailNo" + (countDraft + 1) + "' aria-expanded='false' aria-controls='#detailNo" + (countDraft + 1) + "'><span class='glyphicon glyphicon-chevron-down'></span> Detail No." + (countDraft + 1) + "" +
                //"<button class='btn btn-danger' type='button' onclick='protocolpdf.write(" + countDraft + ")'>Generate protocol PDF</button>" +
                "</button><div class='collapse' id='detailNo" + (countDraft + 1) + "'>" +
                "<div class='well-lg'>" +
                "<div class='container'>" +
                "<table class='table'>" +
                "<thead>" +
                "<tr>" +
                "<th>Name</th>" +
                "<th>Sequence(5' ->3' )</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td class='success'>sgRNA target sequence (plus strand)</td><td class='success'>" + getHTMLgRNA(submitedSequence, countDraft) +
                    "&ensp;<a href='https://crispr.dbcls.jp/detail/en/" + bePITChDesigner.getStatus("species") + "/" + getIUBgRNA(submitedSequence, countDraft) + "' target='_blank'><br>>>>Check sgRNA specificity against genomic DNA using CRISPRdirect</a></td></tr>" +
                    "<tr><td class='danger'>Left microhomology</td><td class='danger'>" + submitedSequence.retrieveDesign("LeftMHarrayOnly", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='info'>Right microhomology</td><td class='info'>" + submitedSequence.retrieveDesign("RightMHarray", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='success'>Desirable labels</td><td class='success'>" + getDesirableFeature(submitedSequence.retrieveDesign("Direction", countDraft), submitedSequence.retrieveDesign("gRNAbindingarray", countDraft).join("")) + "</td></tr>" +
                    "<tr><td class='success'>Undesirable labels</td><td class='success'>" + getUndesirableFeature(submitedSequence.retrieveDesign("Direction", countDraft), submitedSequence.retrieveDesign("gRNAbindingarray", countDraft).join("")) + "</td></tr>" +
                    "<tr><td class='warning'>5'&ensp;forward primer</td><td class='warning'>" + submitedSequence.retrieveDesign("5fwdprimer", countDraft).join("") + " (Tm : " + calcPrimer(submitedSequence.retrieveDesign("5fwdprimerbind", countDraft).join("")) + ")" + "</td></tr>" +
                    "<tr><td class='warning'>5'&ensp;reverse primer</td><td class='warning'>" + submitedSequence.retrieveDesign("5revprimer", countDraft).join("") + " (Tm : " + calcPrimer(submitedSequence.retrieveDesign("5revprimer", countDraft).join("")) + ")" + "</td></tr>" +
                    "<tr><td class='warning'>3'&ensp;forward primer</td><td class='warning'>" + submitedSequence.retrieveDesign("3fwdprimer", countDraft).join("") + " (Tm : " + calcPrimer(submitedSequence.retrieveDesign("3fwdprimer", countDraft).join("")) + ")" + "</td></tr>" +
                    "<tr><td class='warning'>3'&ensp;reverse primer</td><td class='warning'>" + submitedSequence.retrieveDesign("3revprimer", countDraft).join("") + " (Tm : " + calcPrimer(submitedSequence.retrieveDesign("3revprimerbind", countDraft).join("")) + ")" + "</td></tr>" +
                    "<tr><td class='active'>5'&ensp;sequence of knock-in targeting vector</td><td class='active'>" + submitedSequence.retrieveDesign("5vector", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='active'>3'&ensp;sequence of knock-in targeting vector</td><td class='active'>" + submitedSequence.retrieveDesign("3vector", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='success'>Sence oligonucleotide</td><td class='success'>" + submitedSequence.retrieveDesign("pU6gRNAsense", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='success'>Antisence oligonucleotide</td><td class='success'>" + submitedSequence.retrieveDesign("pU6gRNAantisense", countDraft).join("") + "</td></tr>" +
                    "<tr><td class='active'>Best sequence of outer left primer</td><td class='active'>" + pickedPrimer.outerleft[0].primer + " (Tm : " + roundNumber(pickedPrimer.outerleft[0].Tm, 1) + ") " + pickedPrimer.outerleft[0].failure_cause +
                    "&ensp;<a " + ispickedPrimer.outerleft + " href='https://gggenome.dbcls.jp/en/" + bePITChDesigner.getStatus("species") + "/" + pickedPrimer.outerleft[0].primer + "' target='_blank'><br>>>>Check primer specificity against genomic DNA using GGGenome</a></td></tr>" +
                    "<tr><td class='active'>Best sequence of outer right primer</td><td class='active'>" + pickedPrimer.outerright[0].primer + " (Tm : " + roundNumber(pickedPrimer.outerright[0].Tm, 1) + ") " + pickedPrimer.outerright[0].failure_cause +
                    "&ensp;<a " + ispickedPrimer.outerright + " href='https://gggenome.dbcls.jp/en/" + bePITChDesigner.getStatus("species") + "/" + pickedPrimer.outerright[0].primer + "' target='_blank'><br>>>>Check primer specificity against genomic DNA using GGGenome</a></td></tr>" +
                    "<tr><td class='active'>Best sequence of inner left primer</td><td class='active'>" + pickedPrimer.innerleft[0].primer + " (Tm : " + roundNumber(pickedPrimer.innerleft[0].Tm, 1) + ") " + pickedPrimer.innerleft[0].failure_cause +
                    "&ensp;<a " + ispickedPrimer.innerleft + " href='https://gggenome.dbcls.jp/en/" + bePITChDesigner.getStatus("species") + "/" + pickedPrimer.innerleft[0].primer + "' target='_blank'><br>>>>Check primer specificity against genomic DNA using GGGenome</a></td></tr>" +
                    "<tr><td class='active'>Best sequence of inner right primer</td><td class='active'>" + pickedPrimer.innerright[0].primer + " (Tm : " + roundNumber(pickedPrimer.innerright[0].Tm, 1) + ") " + pickedPrimer.innerright[0].failure_cause +
                    "&ensp;<a " + ispickedPrimer.innerright + " href='https://gggenome.dbcls.jp/en/" + bePITChDesigner.getStatus("species") + "/" + pickedPrimer.innerright[0].primer + "' target='_blank'><br>>>>Check primer specificity against genomic DNA using GGGenome</a></td></tr>" +
                    "<tr><td class='active'>Whole sequence of knock-in targeting vector</td><td class='active'>" +
                    "<button type='button' class='btn btn-default' data-toggle='modal' data-target='#WholeSeqtxt" + (countDraft + 1) + "'>" +
                    "Download whole sequence of targeting vector" +
                    "</button>" +
                    "<div class='modal fade bs-example-modal-lg' id='WholeSeqtxt" + (countDraft + 1) + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
                    "<div class='modal-dialog modal-lg' role='document'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                    "<h4 class='modal-title' id='myModalLabel'>Whole sequence of targeting vector</h4>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<div class='form-group'>" +
                    "<label for='exampleTextarea'>FASTA format text</label>" +
                    "<textarea class='form-control' id='WholeSeq' name='WholeSeq' rows='30' style='font-size:10px;' onclick='this.select(0,this.value.length)'>" + ">" + submitedSequence.retrieveData('title') + "&#13;" + submitedSequence.retrieveDesign("wholevector", countDraft).join("") +
                    "</textarea>" +
                    "<a type='button' class='btn btn-primary' id='downloadWholeSeq" + (countDraft + 1) + "' name = " + (countDraft + 1) + " href='#' download='" + submitedSequence.retrieveData('title') + (countDraft + 1) + ".fa' onclick='downloadText(\"wholeTASeq" + (countDraft + 1) + ".fa\", submitedSequence.retrieveDesign(\"wholevector\", " + countDraft + ").join(\"\"), \"downloadWholeSeq" + (countDraft + 1) + "\")'>Download FASTA file</a>" +
                    "</div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" + "</td></tr>" +
                    "</tbody>" +
                    "</table><br><br>"
                    //// The 5'-end sequence of knock-in targeting vector image ////////////////////
                    //The 5'-end sequence of knock-in targeting vectorを描写
                    +
                    "<h4>5' sequence of knock-in cassette on the targeting vector</h4>(<B style='color:#9932CC;'>Purple</B> : PITCh-gRNA#3 target site  / <B style='color:#ff0000;'>Red</B> : Left microhomology)" +
                    "<a type='button' data-toggle='modal' data-target='#modal5Vectorimage" + (countDraft + 1) + "' style='cursor:pointer;'>" +
                    "<canvas id=" + "5Vectorimage" + (countDraft + 1) + " width=1200 height=200 style='background-color:white;'></canvas>" +
                    "</a><br>" +
                    "<a id='converted5Vectorimagelink" + (countDraft + 1) + "' href='' target='_blank'>" +
                    "[ download ]" +
                    "</a><br><br>"
                    //JPEG形式をmodalで表示
                    +
                    "<div class='modal fade bs-example-modal-lg' id='modal5Vectorimage" + (countDraft + 1) + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
                    "<div class='modal-dialog modal-lg' role='document'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                    "<h4 class='modal-title' id='myModalLabel'>The 5'-end sequence of knock-in targeting vector No." + (countDraft + 1) + "</h4>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<div class='form-group'>" +
                    "<img class='img-responsive' id='converted5Vectorimage" + (countDraft + 1) + "' name='The 5'-end sequence of knock-in targeting vector No." + (countDraft + 1) + "' src=''>" +
                    "</div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                    //// The 3'-end sequence of knock-in targeting vector image ////////////////////
                    //The 3'-end sequence of knock-in targeting vectorを描写
                    +
                    "<h4>3' sequence of knock-in cassette on the targeting vector</h4>(<B style='color:#9932CC;'>Purple</B> : PITCh-gRNA#3 target site  / <B style='color:#0000ff;'>Blue</B> : Right microhomology)" +
                    "<a type='button' data-toggle='modal' data-target='#modal3Vectorimage" + (countDraft + 1) + "' style='cursor:pointer;'>" +
                    "<canvas id=" + "3Vectorimage" + (countDraft + 1) + " width=1200 height=200 style='background-color:white;'></canvas>" +
                    "</a><br>" +
                    "<a id='converted3Vectorimagelink" + (countDraft + 1) + "' href='' target='_blank'>" +
                    "[ download ]" +
                    "</a><br><br>" +
                    "</div>"
                    //JPEG形式をmodalで表示
                    +
                    "<div class='modal fade bs-example-modal-lg' id='modal3Vectorimage" + (countDraft + 1) + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
                    "<div class='modal-dialog modal-lg' role='document'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                    "<h4 class='modal-title' id='myModalLabel'>The 3'-end sequence of knock-in targeting vector No." + (countDraft + 1) + "</h4>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<div class='form-group'>" +
                    "<img class='img-responsive' id='converted3Vectorimage" + (countDraft + 1) + "' name='The 3'-end sequence of knock-in targeting vector No." + (countDraft + 1) + "' src=''>" +
                    "</div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
            }
            //HTML書き込み
            document.getElementById("designCRISPITCh").innerHTML = madeDraft;
            madeDraft = null;

            //記述したHTMLにおけるイベント・描写設定
            for (var countDraft = 0; submitedSequence.hasAllDesign(countDraft, []) == true; countDraft++) {
                //[E]Drawing Knock-in image in canvas
                drawCanvasKIimage(submitedSequence, countDraft);
                drowCanvas5TAVector(submitedSequence, countDraft);
                drowCanvas3TAVector(submitedSequence, countDraft);
                //スクロールして移動
                scrollID("designCRISPITCh");
                //making imagefile
                makeJPEG("KIimage" + (countDraft + 1), "convertedKIimage" + (countDraft + 1), "img");
                makeJPEG("5Vectorimage" + (countDraft + 1), "converted5Vectorimage" + (countDraft + 1), "img");
                makeJPEG("3Vectorimage" + (countDraft + 1), "converted3Vectorimage" + (countDraft + 1), "img");
                makeJPEG("KIimage" + (countDraft + 1), "convertedKIimagelink" + (countDraft + 1), "a");
                makeJPEG("5Vectorimage" + (countDraft + 1), "converted5Vectorimagelink" + (countDraft + 1), "a");
                makeJPEG("3Vectorimage" + (countDraft + 1), "converted3Vectorimagelink" + (countDraft + 1), "a");
            }

            //genotyping用プライマービュワーを作成
            genotypingprimerviewer = new viewGenomePrimers(submitedSequence, "genomeviewer");
            //genotyping用プライマーボタンイベント設定
            $("#genomeviewer [id^='primerbutton-']").on({
                'click': function() {
                    genotypingprimerviewer.enterPCRinfoText(this.id);
                },
                'mouseover': function() {
                    genotypingprimerviewer.reflectPCRinfoView(this.id);
                },
                'mouseout': function() {
                    genotypingprimerviewer.clearPCRinfoView();
                }
            });
            //プライマーダウンロードボタンイベント設定(onclick_downloadgpseq参照)
            $("#genomeviewer #" + genotypingprimerviewer.DownloadButtonID).on({
                'click': function() {
                    genotypingprimerviewer.downloadText();
                }
            });
        };
        //デザインできた数をmodalで表示
        document.getElementById('resultmodal').innerHTML = "" +
            "<div class='modal fade' id='Result' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
            "<div class='modal-dialog' role='document'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            "<h4 class='modal-title' id='myModalLabel'>RESULT</h4>" +
            "</div>" +
            "<div class='modal-body'>" +
            (submitedSequence.retrieveDesign("DraftMaxNum", 0) + 1) + " dataset designed." +
            "</div>" +
            "<div class='modal-footer'>" +
            "<button type='button' class='btn btn-default' data-dismiss='modal'>OK</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $('#Result').modal('show')
        isSuccess = true;
    }
    return isSuccess;
}

//////////debug///////////////////////////////////////////////////////////////////////
if (false) {
    var test = new designCRISPITCh();
    submitedSequence.setData(selPrimer, "evalPrimerFunc")
    var testfunc = function() { return test.evalPrimerFunc("ATTCCTCCGCCCC") }
    console.log(testfunc())
}