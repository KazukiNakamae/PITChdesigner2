/**
 * @license
 * Copyright (c) 2016 Kazuki Nakamae.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
//version 1.1
//update date 2017/5/5
"use strict";
//function//////////////////////////////////////////////////////////////////////

//check 
if (typeof setInherits !== "undefined") {
    console.warn("[Warn] knockinjs library defines newly setInherits() at global scope level.");
}
/**
 * @description Sets the prototype
 * @function setInherits
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {Object} childCtor  child constructor
 * @param {Object} parentCtor parent constructor
 */
var setInherits = function(childCtor, parentCtor) {
    Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};
//check
if (typeof setInherits !== "undefined") {
    console.info("[Info] setInherits() is defined at global scope level.");
}

//inputSequence class///////////////////////////////////////////////////////////
/**
 * @namespace inputSequence
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @classdesc Enter sequence and operate sequence
 * @param {string} [inputTitle=no_title]        Title
 * @param {string} [inputSeq]          Target sequence
 * @param {number} [shiftedFrameNum=0]   Reading frame
 * @param {number} [inputtargetedPos=41]  Target position
 */
var inputSequence = inputSequence || {};
inputSequence = function(inputTitle, inputSeq, shiftedFrameNum, inputtargetedPos) {
    if (typeof inputTitle === "undefined") {
        this.inputTitle = "no_title";
    } else {
        this.inputTitle = inputTitle;
    }
    console.info("[Set] this.inputTitle : " + this.inputTitle);
    if (typeof inputSeq === "undefined") {
        this.inputSeq = "";
        console.info("This class need input sequences as input\nUSAGE:Constructor(<inputTitle>,<inputSeq>,<shiftedFrameNum>,<inputtargetedPos>)\nOR\nsetData(<inputSeq>,'sequence') after declearing instance");
    } else {
        this.inputSeq = inputSeq.toUpperCase();
    }
    console.info("[Set] this.inputSeq : " + this.inputSeq);
    if (typeof shiftedFrameNum === "undefined") {
        this.shiftedFrameNum = 0;
    } else {
        this.shiftedFrameNum = shiftedFrameNum;
    }
    console.info("[Set] this.shiftedFrameNum : " + this.shiftedFrameNum);
    if (typeof inputtargetedPos === "undefined") {
        this.inputtargetedPos = 41;
    } else {
        this.inputtargetedPos = inputtargetedPos;
    }
    console.info("[Set] this.inputtargetedPos : " + this.inputtargetedPos);
};

/**
 * Change the input sequence and targeting data using KnockIn design (Public setter method)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {(string|number)} inputData Setting value
 * @param  {string} inputDataType Type of data
 * @return {boolean} isSuccess true:success|false:failture
 */
inputSequence.prototype.setData = function(inputData, inputDataType) {
    var isSuccess = false;
    try {
        if (inputDataType === "title") {
            this.inputTitle = inputData;
        } else if (inputDataType === "sequence") {
            if (typeof inputData === 'string') {
                this.inputSeq = inputData.toUpperCase();
            } else {
                throw new Error("Sequence data is not string");
            }
        } else if (inputDataType === "shiftedFrameNum") {
            this.shiftedFrameNum = inputData;
        } else if (inputDataType === "targetedPos") {
            this.inputtargetedPos = inputData;
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
};

/**
 * Getter (private method)
 *  : This method is private method. The public getter method is retrieveData().
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   type of data
 * @return {?(string|number)} returnedData  gotten data
 *
 */
inputSequence.prototype.getData_ = function(getDataType) {
    var returnedData = null;
    if (getDataType === "title") {
        returnedData = this.inputTitle;
    } else if (getDataType === "sequence") {
        returnedData = this.inputSeq;
    } else if (getDataType === "shiftedFrameNum") {
        returnedData = this.shiftedFrameNum;
    } else if (getDataType === "targetedPos") {
        returnedData = this.inputtargetedPos;
    }
    return returnedData;
};

/**
 * Getter (private method)
 *  : This method is private method. The public getter method is retrieveData().
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   type of data
 * @return {?(Array|number)} returnedData  made data
 */
inputSequence.prototype.makeData_ = function(getDataType) {
    var returnedData = null;
    if (getDataType === "sequencearray") {
        returnedData = this.getData_("sequence").split("");
    } else if (getDataType === "inputTotalLen") {
        returnedData = this.getData_("sequence").length;;
    } else if (getDataType === "remainedBaseNum") { //[J]フレームも考慮にいれた標的コドンにおいて標的塩基から3'方向に余る塩基の数
        returnedData = (this.inputtargetedPos - this.shiftedFrameNum) % 3;
    }
    return returnedData;
};

/**
 * Get the input sequence and targeting data using KnockIn design (Public getter method)
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {string} getDataType   type of data
 * @return {?(string|Array|number)} returnedData  gotten or made data
 */
inputSequence.prototype.retrieveData = function(getDataType) {
    var returnedData = null;
    try {
        returnedData = this.getData_(getDataType);
        if (returnedData === null) {
            returnedData = this.makeData_(getDataType);
            if (returnedData === null) {
                throw new Error("Undefined DataType or Getting feilture : " + getDataType);
            }
        }
    } catch (e) {
        console.error(e);
    }
    return returnedData;
};

/**
 * get complementaly base
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {string} inputBase     base
 * @param {string} getNucType    type of nucleotide acid
 * @return {string} returnedData  gotten complementaly base
 */
inputSequence.prototype.getCompBase = function(inputBase, getNucType) {
    var complementBase = null;
    try {
        if (inputBase === "A" && getNucType === "DNA") {
            complementBase = "T";
        } else if (inputBase === "A" && getNucType === "RNA") {
            complementBase = "U";
        } else if (inputBase === "T") {
            complementBase = "A";
        } else if (inputBase === "C") {
            complementBase = "G";
        } else if (inputBase === "G") {
            complementBase = "C";
        } else if (inputBase === "U") {
            complementBase = "A";
        } else {
            throw new Error("Undefined nucleotide type : " + getNucType);
        }
    } catch (e) {
        console.error(e);
    }
    return complementBase;
};

/**
 * Confirm whether bases is same on IUB code (private method)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} inputBase compared base
 * @param {string} refBase   reference base (IUB code)
 * @return {boolean} isSame    whether bases is same(true:same/false:different)
 */
inputSequence.prototype.isSameBase_ = function(inputBase, refBase) {
    var isSame = false;
    if ((refBase === "Y") && (inputBase === "T" || inputBase === "C" || inputBase === "U")) {
        isSame = true;
    } else if ((refBase === "R") && (inputBase === "A" || inputBase === "G")) {
        isSame = true;
    } else if ((refBase === "M") && (inputBase === "A" || inputBase === "C")) {
        isSame = true;
    } else if ((refBase === "K") && (inputBase === "T" || inputBase === "G")) {
        isSame = true;
    } else if ((refBase === "S") && (inputBase === "G" || inputBase === "C")) {
        isSame = true;
    } else if ((refBase === "W") && (inputBase === "T" || inputBase === "A")) {
        isSame = true;
    } else if ((refBase === "B") && (inputBase === "G" || inputBase === "C" || inputBase === "T")) {
        isSame = true;
    } else if ((refBase === "H") && (inputBase === "A" || inputBase === "C" || inputBase === "T")) {
        isSame = true;
    } else if ((refBase === "V") && (inputBase === "A" || inputBase === "C" || inputBase === "G")) {
        isSame = true;
    } else if ((refBase === "D") && (inputBase === "A" || inputBase === "G" || inputBase === "T")) {
        isSame = true;
    } else if ((refBase === "N")) {
        isSame = true;
    } else if (refBase === inputBase) {
        isSame = true;
    }
    return isSame;
};

/**
 * Translate codon into amino acid
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} inputCodon codon
 * @return {string} returnedAA amino acid
 */
inputSequence.prototype.convertCodon = function(inputCodon) {
    inputCodon = inputCodon.toUpperCase()
    var referenceCodon = {
        "TTT": "Phe",
        "TTC": "Phe",
        "TTA": "Leu",
        "TTG": "Leu",
        "CTT": "Leu",
        "CTC": "Leu",
        "CTA": "Leu",
        "CTG": "Leu",
        "ATT": "Ile",
        "ATC": "Ile",
        "ATA": "Ile",
        "ATG": "Met",
        "GTT": "Val",
        "GTC": "Val",
        "GTA": "Val",
        "GTG": "Val",
        "TCT": "Ser",
        "TCC": "Ser",
        "TCA": "Ser",
        "TCG": "Ser",
        "CCT": "Pro",
        "CCC": "Pro",
        "CCA": "Pro",
        "CCG": "Pro",
        "ACT": "Thr",
        "ACC": "Thr",
        "ACA": "Thr",
        "ACG": "Thr",
        "GCT": "Ala",
        "GCC": "Ala",
        "GCA": "Ala",
        "GCG": "Ala",
        "TAT": "Tyr",
        "TAC": "Tyr",
        "TAA": "STOP",
        "TAG": "STOP",
        "CAT": "His",
        "CAC": "His",
        "CAA": "Gln",
        "CAG": "Gln",
        "AAT": "Asn",
        "AAC": "Asn",
        "AAA": "Lys",
        "AAG": "Lys",
        "GAT": "Asp",
        "GAC": "Asp",
        "GAA": "Glu",
        "GAG": "Glu",
        "TGT": "Cys",
        "TGC": "Cys",
        "TGA": "STOP",
        "TGG": "Trp",
        "CGT": "Arg",
        "CGC": "Arg",
        "CGA": "Arg",
        "CGG": "Arg",
        "AGT": "Ser",
        "AGC": "Ser",
        "AGA": "Arg",
        "AGG": "Arg",
        "GGT": "Gly",
        "GGC": "Gly",
        "GGA": "Gly",
        "GGG": "Gly",
    }
    var returnedAA = referenceCodon[inputCodon];
    //不明なコドンの場合は無名表記
    if (typeof(returnedAA) === "undefined") {
        returnedAA = "---";
    }
    return returnedAA;
};

/**
 * check whether base is C/G
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param {number} base       checked base
 * @return {boolean} whether checked base is C/G
 * generateGPrimer()の補助メソッド
 */
inputSequence.prototype.isCG_ = function(base) {
    return /^[CG]$/i.test(base);
};

/**
 * Sort array including object as member.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {array} objArray unsorted array
 * @param  {string} key key for objArray
 * @param  {string} order sorting order ("desc" : descending order (default) | "asc" : ascending order)
 */
inputSequence.prototype.sortObjarray = function(objArray, key, order) {
    //descending order (default)
    var num_a = -1;
    var num_b = 1;

    if (order === 'asc') { //ascending order
        num_a = 1;
        num_b = -1;
    }

    //sorting
    var sortedObjArray = [].slice.call(objArray).sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        if (typeof x === 'number' && typeof y === 'number') {
            if (x > y) return num_a;
            if (x < y) return num_b;
        } else if (typeof x === 'string' && typeof y === 'string') {
            if (x.length > y.length) return num_a;
            if (x.length < y.length) return num_b;
        } else {
            console.error("type is illegal. x : " + (typeof x) + "y : " + (typeof y));
        }
        return 0;
    });

    return sortedObjArray;
};


//designCRISPITCh class/////////////////////////////////////////////////////////
/**
 * @namespace designCRISPITCh
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @classdesc Design sequence for CRISPITCh system
 * @extends inputSequence
 * @param {string} [inputTitle=no_title]        Title
 * @param {string} [inputSeq]          Target sequence
 * @param {number} [shiftedFrameNum=0]   Reading frame
 * @param {number} [inputtargetedPos=41]  Target position
 * @param {string} [userInsert=""]  insert GOI (optional)
 * @param {function} [evalPrimerFunc=function(x) { return x.length; }]  evaluation function for primer selection (optional)
 * If setting userInsert, forced to change "PrimerType" to "UserSet"
 */
var designCRISPITCh = designCRISPITCh || {};
designCRISPITCh = function(inputTitle, inputSeq, shiftedFrameNum, inputtargetedPos, userInsert, evalPrimerFunc) {
    //既存メンバ変数の継承
    inputSequence.call(this, inputTitle, inputSeq, shiftedFrameNum, inputtargetedPos);
    //新規メンバの登録
    if (typeof userInsert === "undefined") {
        this.userInsert = "";
    } else {
        this.userInsert = userInsert.toUpperCase();
    }
    console.info("[Set] this.userInsert : " + this.userInsert);
    if (typeof evalPrimerFunc === "undefined") {
        this.evalPrimerFunc = function(x) { return x.length; };
    } else {
        this.evalPrimerFunc = evalPrimerFunc;
    }
    console.info("[Set] this.evalPrimerFunc : " + this.evalPrimerFunc);
    //設計オプション
    this.inputPAMpattarray = ["N", "G", "G"];
    this.designLeftMHLen = 20;
    this.designRightMHLen = 20;
    this.designMHmethod = "C-insertion";
    this.designPrimerType = "EGFP2APuroR";
    //設計結果
    this.designedDraftMaxNum = null;
    this.designedDirection = [null];
    this.designedPAMendPos = [null];
    this.designedgRNAendPos = [null];
    this.designedCutPos = [null];
    this.designedRightMH = [null];
    this.designedRightMHEndpos = [null];
    this.designedLeftMH = [null];
    this.designedLeftMHEndPos = [null];
    //genotyping用プライマー設計
    this.outerleftgenomeprimers = [];
    this.outerrightgenomeprimers = [];
    this.innerleftgenomeprimers = [];
    this.innerrightgenomeprimers = [];
    //インサート用プライマー・ベクターセットリスト
    this.leftinsertSets = [];
    this.rightinsertSets = [];
    //プリセット
    this.loadedSeqList = {
        "EGFP2APuroR": {
            "5fwdfore": "CCGGATCCATGGTGAGCAAGGG",
            "5fwdrear": "CCGCGTTACATAGCATCGTACGCGTACGTGTTTGG",
            "5rev": "TGCTATGTAACGCGGAACTCCATATATGGG",
            "3fwd": "CAAACACGTACGCGTACGATGCTCTAGAATG",
            "3revfore": "TCAGGCACCGGGCTTGCG",
            "3revrear": "ACGCGTACGTGTTTGG",
            "5vectorfore": "CCGGATCCATGGTGAGCAAGGGCGA",
            "5vectorrear": "TAGCCCATATATGGAGTTCCGCGTTACATAGCATCGTACGCGTACGTGTTTGG",
            "3vectorfore": "CCAAACACGTACGCGTACGATGCTCTAGAATGCTG",
            "3vectorrear": "ACCCGCAAGCCCGGTGCCTGA"
        },
        "CMV-EGFP2APuroR": {
            "5fwdfore": "CAGCTGGTTCTTTCCGCCTCAGAAGCC",
            "5fwdrear": "ACGCGTACGTGTTTGG",
            "5rev": "CAAACACGTACGCGTACGATGCTATGTAACGC",
            "3fwd": "TCTAGAATGCTGATGGGCTAGCAAAATCAGCCTC",
            "3revfore": "GCTTCGCGATGTACGGGCCAGATATACG",
            "3revrear": "CATCAGCATTCTAGAGCATCGTACGCGTACGTGTTTGG",
            "5vectorfore": "CAGCTGGTTCTTTCCGCCTCAGAAGCCATA",
            "5vectorrear": "TCCGCGTTACATAGCATCGTACGCGTACGTGTTTGG",
            "3vectorfore": "CCAAACACGTACGCGTACGATGCTCTAGAATGCTGATGGGCTAGCAAAATCAGCCTCGAC",
            "3vectorrear": "ACGCGTATATCTGGCCCGTACATCGCGAAGC"
        },
        "UserSet": {
            "5fwdfore": "",
            "5fwdrear": "ACGCGTACGTGTTTGG",
            "5rev": "CAAACACGTACGCGTACGATGCTATGTAACGC",
            "3fwd": "TCTAGAATGCTGATGGGCTAGCAAAATCAGCCTC",
            "3revfore": "",
            "3revrear": "CATCAGCATTCTAGAGCATCGTACGCGTACGTGTTTGG",
            "5vectorfore": "",
            "5vectorrear": "TCCGCGTTACATAGCATCGTACGCGTACGTGTTTGG",
            "3vectorfore": "CCAAACACGTACGCGTACGATGCTCTAGAATGCTGATGGGCTAGCAAAATCAGCCTCGAC",
            "3vectorrear": ""
        }
    };
    this.loadedVectorSeqList = {
        "5backbone": "CTCATGACCAAAATCCCTTAACGTGAGTTACGCGCGCGTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTTCTTCTAGTGTAGCCGTAGTTAGCCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGGCGAGAGTAGGGAACTGCCAGGCATCAAACTAAGCAGAAGGCCCCTGACGGATGGCCTTTTTGCGTTTCTACAAACTCTTTCTGTGTTGTAAAACGACGGCCAGTCTTAAGCTCGGGCCCCCTGGGCGGTTCTGATAACGAGTAATCGTTAATCCGCAAATAACGTAAAAACCCGCTTCGGCGGGTTTTTTTATGGGGGGAGTTTAGGGAAAGAGCATTTGTCAGAATATTTAAGGGCGCCTGTCACTTTGCTTGATATATGAGAATTATTTAACCTTATAAATGAGAAAAAAGCAACGCACTTTAAATAAGATACGTTGCTTTTTCGATTGATGAACACCTATAATTAAACTATTCATCTATTATTTATGATTTTTTGTATATACAATATTTCTAGTTTGTTAAAGAGAATTAAGAAAATAAATCTCGAAAATAATAAAGGGAAAATCAGTTTTTGATATCAAAATTATACATGTCAACGATAATACAAAATATAATACAAACTATAAGATGTTATCAGTATTTATTATCATTTAGAATAAATTTTGTGTCGCCCTTAATTGTGAGCGGATAACAATTACGAGCTTCATGCACAGTGGCGTTGACATTGATTATTGACTAGTTATTAATAGTAATCAATTACGGGGTCATTAGTTCATAGCCCATATATGGAGTTCCGCGTTACATAGCATCGTACGCGTACGTGTTTGG",
        "3backbone": "CCAAACACGTACGCGTACGATGCTCTAGAATGCTGATGGGCTAGCAAAATCAGCCTCGACTGTGCCTTCTAGTTGCCAGCCATCTGTTGTTTGCCCCTCCCCCGTGCCTTCCTTGACCCTGGAAGGTGCCACTCCCACTGTCCTTTCCTAATAAAATGAGGAAATTGCATCACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTAATTCTGTGGAATGTGTGTCAGTTAGGGTGTGGAAAGTCCCCAGGCTCCCCAGCAGGCAGAAGTATGCAAAGCATGCATCTCAATTAGTCAGCAACCAGGTGTGGAAAGTCCCCAGGCTCCCCAGCAGGCAGAAGTATGCAAAGCATGCATCTCAATTAGTCAGCAACCATAGTCCCGCCCCTAACTCCGCCCATCCCGCCCCTAACTCCGCCCAGTTCCGCCCATTCTCCGCCCCATGGCTGACTAATTTTTTTTATTTATGCAGAGGCCGAGGCCGCCTCTGCCTCTGAGCTATTCCAGAAGTAGTGAGGAGGCTTTTTTGGAGGCCTAGGCTTTTGCAAAAAGCTCCCGGGAGCTTGTATATCCATTTTCGGATCTGATCAGCACGTGATGAAAAAGCCTGAACTCACCGCGACGTCTGTCGAGAAGTTTCTGATCGAAAAGTTCGACAGCGTTTCCGACCTGATGCAGCTCTCGGAGGGCGAAGAATCTCGTGCTTTCAGCTTCGATGTAGGAGGGCGTGGATATGTCCTGCGGGTAAATAGCTGCGCCGATGGTTTCTACAAAGATCGTTATGTTTATCGGCACTTTGCATCGGCCGCGCTCCCGATTCCGGAAGTGCTTGACATTGGGGAATTCAGCGAGAGCCTGACCTATTGCATCTCCCGCCGTGCACAGGGTGTCACGTTGCAAGACCTGCCTGAAACCGAACTGCCCGCTGTTCTGCAGCCGGTCGCGGAGGCCATGGATGCGATCGCTGCGGCCGATCTTAGCCAGACGAGCGGGTTCGGCCCATTCGGACCGCAAGGAATCGGTCAATACACTACATGGCGTGATTTCATATGCGCGATTGCTGATCCCCATGTGTATCACTGGCAAACTGTGATGGACGACACCGTCAGTGCGTCCGTCGCGCAGGCTCTCGATGAGCTGATGCTTTGGGCCGAGGACTGCCCCGAAGTCCGGCACCTCGTGCACGCGGATTTCGGCTCCAACAATGTCCTGACGGACAATGGCCGCATAACAGCGGTCATTGACTGGAGCGAGGCGATGTTCGGGGATTCCCAATACGAGGTCGCCAACATCTTCTTCTGGAGGCCGTGGTTGGCTTGTATGGAGCAGCAGACGCGCTACTTCGAGCGGAGGCATCCGGAGCTTGCAGGATCGCCGCGGCTCCGGGCGTATATGCTCCGCATTGGTCTTGACCAACTCTATCAGAGCTTGGTTGACGGCAATTTCGATGATGCAGCTTGGGCGCAGGGTCGATGCGACGCAATCGTCCGATCCGGAGCCGGGACTGTCGGGCGTACACAAATCGCCCGCAGAAGCGCGGCCGTCTGGACCGATGGCTGTGTAGAAGTACTCGCCGATAGTGGAAACCGACGCCCCAGCACTCGTCCGAGGGCAAAGGAATAGCACGTGCTACGAGATTTCGATTCCACCGCCGCCTTCTATGAAAGGTTGGGCTTCGGAATCGTTTTCCGGGACGCCGGCTGGATGATCCTCCAGCGCGGGGATCTCATGCTGGAGTTCTTCGCCCACCCCAACTTGTTTATTGCAGCTTATAATGGTTACAAATAAAGCAATAGCATCACAAATTTCACAAATAAAGCATTTTTTTCACTGCATTCTAGTTGTGGTTTGTCCAAACTCATCAATGTATCTTATCATGTCTGTATACCGTCGACCTCTAGCTAGAGCTTGGCGTAATCATGGTCATTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCATCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGCGCTGCGATGATACCGCGAGAACCACGCTCACCGGCTCCGGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTCCTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTGCGCAACGTTGTTGCCATCGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCAACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAAGTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGCTTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTCAATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCTCAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTCACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAATACTCATATTCTTCCTTTTTCAATATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTATTTAGAAAAATAAACAAATAGGGGTCAGTGTTACAACCAATTAACCAATTCTGAACATTATCGCGAGCCCATTTATACCTGAATATGGCTCATAACACCCCTTG",
        "EGFP2APuroRinsert": "CCGGATCCATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAGGGAAGCGGAGAGGGCAGAGGAAGTCTGCTAACATGCGGTGACGTCGAGGAGAATCCTGGACCTATGACCGAGTACAAGCCCACGGTGCGCCTCGCCACCCGCGACGACGTCCCCCGGGCCGTACGCACCCTCGCCGCCGCGTTCGCCGACTACCCCGCCACGCGCCACACCGTCGACCCGGACCGCCACATCGAGCGGGTCACCGAGCTGCAAGAACTCTTCCTCACGCGCGTCGGGCTCGACATCGGCAAGGTGTGGGTCGCGGACGACGGCGCCGCGGTGGCGGTCTGGACCACGCCGGAGAGCGTCGAAGCGGGGGCGGTGTTCGCCGAGATCGGCCCGCGCATGGCCGAGTTGAGCGGTTCCCGGCTGGCCGCGCAGCAACAGATGGAAGGCCTCCTGGCGCCGCACCGGCCCAAGGAGCCCGCGTGGTTCCTGGCCACCGTCGGCGTCTCGCCCGACCACCAGGGCAAGGGTCTGGGCAGCGCCGTCGTGCTCCCCGGAGTGGAGGCGGCCGAGCGCGCCGGGGTGCCCGCCTTCCTGGAGACCTCCGCGCCCCGCAACCTCCCCTTCTACGAGCGGCTCGGCTTCACCGTCACCGCCGACGTCGAGGTGCCCGAAGGACCGCGCACCTGGTGCATGACCCGCAAGCCCGGTGCCTGA",
        "CMV-EGFP2APuroRinsert": "CAGCTGGTTCTTTCCGCCTCAGAAGCCATAGAGCCCACCGCATCCCCAGCATGCCTGCTATTGTCTTCCCAATCCTCCCCCTTGCTGTCCTGCCCCACCCCACCCCCCAGAATAGAATGACACCTACTCAGACAATGCGATGCAATTTCCTCATTTTATTAGGAAAGGACAGTGGGAGTGGCACCTTCCAGGGTCAAGGAAGGCACGGGGGAGGGGCAAACAACAGATGGCTGGCAACTAGAAGGCACAGTCGAGGCTGATCAGCGGGTTTAAACTCATCAGGCACCGGGCTTGCGGGTCATGCACCAGGTGCGCGGTCCTTCGGGCACCTCGACGTCGGCGGTGACGGTGAAGCCGAGCCGCTCGTAGAAGGGGAGGTTGCGGGGCGCGGAGGTCTCCAGGAAGGCGGGCACCCCGGCGCGCTCGGCCGCCTCCACTCCGGGGAGCACGACGGCGCTGCCCAGACCCTTGCCCTGGTGGTCGGGCGAGACGCCGACGGTGGCCAGGAACCACGCGGGCTCCTTGGGCCGGTGCGGCGCCAGGAGGCCTTCCATCTGTTGCTGCGCGGCCAGCCGGGAACCGCTCAACTCGGCCATGCGCGGGCCGATCTCGGCGAACACCGCCCCCGCTTCGACGCTCTCCGGCGTGGTCCAGACCGCCACCGCGGCGCCGTCGTCCGCGACCCACACCTTGCCGATGTCGAGCCCGACGCGCGTGAGGAAGAGTTCTTGCAGCTCGGTGACCCGCTCGATGTGGCGGTCCGGGTCGACGGTGTGGCGCGTGGCGGGGTAGTCGGCGAACGCGGCGGCGAGGGTGCGTACGGCCCGGGGGACGTCGTCGCGGGTGGCGAGGCGCACCGTGGGCTTGTACTCGGTCATAGGTCCAGGATTCTCCTCGACGTCACCGCATGTTAGCAGACTTCCTCTGCCCTCTCCGCTTCCATGGTGATGGTGATGATGACCGGTATGCATATTCAGATCCTCTTCTGAGATGAGTTTTTGTTCGAAGGGCCCTCTAGACTCGAGCTTGTACAGCTCGTCCATGCCGAGAGTGATCCCGGCGGCGGTCACGAACTCCAGCAGGACCATGTGATCGCGCTTCTCGTTGGGGTCTTTGCTCAGGGCGGACTGGGTGCTCAGGTAGTGGTTGTCGGGCAGCAGCACGGGGCCGTCGCCGATGGGGGTGTTCTGCTGGTAGTGGTCGGCGAGCTGCACGCTGCCGTCCTCGATGTTGTGGCGGATCTTGAAGTTCACCTTGATGCCGTTCTTCTGCTTGTCGGCCATGATATAGACGTTGTGGCTGTTGTAGTTGTACTCCAGCTTGTGCCCCAGGATGTTGCCGTCCTCCTTGAAGTCGATGCCCTTCAGCTCGATGCGGTTCACCAGGGTGTCGCCCTCGAACTTCACCTCGGCGCGGGTCTTGTAGTTGCCGTCGTCCTTGAAGAAGATGGTGCGCTCCTGGACGTAGCCTTCGGGCATGGCGGACTTGAAGAAGTCGTGCTGCTTCATGTGGTCGGGGTAGCGGCTGAAGCACTGCACGCCGTAGGTCAGGGTGGTCACGAGGGTGGGCCAGGGCACGGGCAGCTTGCCGGTGGTGCAGATGAACTTCAGGGTCAGCTTGCCGTAGGTGGCATCGCCCTCGCCCTCGCCGGACACGCTGAACTTGTGGCCGTTTACGTCGCCGTCCAGCTCGACCAGGATGGGCACCACCCCGGTGAACAGCTCCTCGCCCTTGCTCACCATGGTGGATCCGAGCTTATCTGCCAAAGTTGGCGTTTATTCTGAGCTTCTGCAAAAAGAACAAGCAAGCTTAACTAGCCAGCTTGGGTCTCCCTATAGTGAGTCGTATTAATTTCGATAAGCCAGTAAGCAGTGGGTTCTCTAGTTAGCCAGAGAGCTCTGCTTATATAGACCTCCCACCGTACACGCCTACCGCCCATTTGCGTCAATGGGGCGGAGTTGTTACGACATTTTGGAAAGTCCCGTTGATTTTGGTGCCAAAACAAACTCCCATTGACGTCAATGGGGTGGAGACTTGGAAATCCCCGTGAGTCAAACCGCTATCCACGCCCATTGATGTACTGCCAAAACCGCATCACCATGGTAATAGCGATGACTAATACGTAGATGTACTGCCAAGTAGGAAAGTCCCATAAGGTCATGTACTGGGCATAATGCCAGGCGGGCCATTTACCGTCATTGACGTCAATAGGGGGCGTACTTGGCATATGATACACTTGATGTACTGCCAAGTGGGCAGTTTACCGTAAATACTCCACCCATTGACGTCAATGGAAAGTCCCTATTGGCGTTACTATGGGAACATACGTCATTATTGACGTCAATGGGCGGGGGTCGTTGGGCGGTCAGCCAGGCGGGCCATTTACCGTAAGTTATGTAACGCGGAACTCCATATATGGGCTATGAACTAATGACCCCGTAATTGATTACTATTAATAACTAGTCAATAATCAATGTCAACGCGTATATCTGGCCCGTACATCGCGAAGC"
    };
    //adjust primer
    if (this.userInsert !== "") {
        this.setMethod("UserSet", "PrimerType");
        if (!this.adjUserdesign()) {
            console.error("insert primer can't be designed. Please change insert sequence.")
        };
    }
};
//methodの継承
setInherits(designCRISPITCh, inputSequence);

//override//////////////////////////////////
/**
 * Change the input sequence and targeting data using KnockIn design (Public setter method)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param  {(string|number)} inputData Setting value
 * @param  {string} inputDataType Type of data
 * @return {boolean} isSuccess true:success|false:failture
 */
designCRISPITCh.prototype.setData = function(inputData, inputDataType) {
    var isSuccess = false;
    try {
        if (inputDataType === "title") {
            this.inputTitle = inputData;
        } else if (inputDataType === "sequence") {
            if (typeof inputData === 'string') {
                this.inputSeq = inputData.toUpperCase();
            } else {
                throw new Error("Sequence data is not string");
            }
        } else if (inputDataType === "shiftedFrameNum") {
            this.shiftedFrameNum = inputData;
        } else if (inputDataType === "targetedPos") {
            this.inputtargetedPos = inputData;
        } else if (inputDataType === "userInsert") {
            if (typeof inputData === 'string') {
                this.userInsert = inputData.toUpperCase();
                if (!this.adjUserdesign()) {
                    throw new Error("insert primer can't be designed. Please change insert sequence.");
                }
            } else {
                throw new Error("User's insert data is not string");
            }
        } else if (inputDataType === "evalPrimerFunc") {
            this.evalPrimerFunc = inputData;
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
};

/**
 * Getter (private method)
 *  : This method is private method. The public getter method is retrieveData().
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   type of data
 * @return {?(string|number)} returnedData  gotten data
 *
 */
designCRISPITCh.prototype.getData_ = function(getDataType) {
    var returnedData = null;
    if (getDataType === "title") {
        returnedData = this.inputTitle;
    } else if (getDataType === "sequence") {
        returnedData = this.inputSeq;
    } else if (getDataType === "shiftedFrameNum") {
        returnedData = this.shiftedFrameNum;
    } else if (getDataType === "targetedPos") {
        returnedData = this.inputtargetedPos;
    } else if (getDataType === "userInsert") {
        returnedData = this.userInsert;
    } else if (getDataType === "evalPrimerFunc") {
        returnedData = this.evalPrimerFunc;
    }
    return returnedData;
};

/**
 * Getter (private method)
 *  : This method is private method. The public getter method is retrieveData().
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   type of data
 * @return {?(Array|number)} returnedData  made data
 */
designCRISPITCh.prototype.makeData_ = function(getDataType) {
    var returnedData = null;
    if (getDataType === "sequencearray") {
        returnedData = this.getData_("sequence").split("");
    } else if (getDataType === "inputTotalLen") {
        returnedData = this.getData_("sequence").length;;
    } else if (getDataType === "remainedBaseNum") { //[J]フレームも考慮にいれた標的コドンにおいて標的塩基から3'方向に余る塩基の数
        returnedData = (this.inputtargetedPos - this.shiftedFrameNum) % 3;
    } else if (getDataType === "userinsertarray") {
        returnedData = this.getData_("userInsert").split("");
    }
    return returnedData;
};

////////////////////////////////////////////

/**
 * Change the CRISPITCh design method
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {(string|Array|number)} inputData Setting value
 * @param {string} inputDataType Type of data
 * @return {boolean} isSuccess true:success|false:failture
 * "MHMethod" : {"C-insertion" | "codon-deletion"}
 * "PrimerType" : {"EGFP2APuroR" | "CMV-EGFP2APuroR" | "UserSet"}
 */
designCRISPITCh.prototype.setMethod = function(inputData, inputDataType) {
    var isSuccess = false;
    try {
        if (inputDataType === "PAM") {
            this.inputPAMpattarray = inputData;
        } else if (inputDataType === "LeftMHlen") {
            inputData = parseInt(inputData);
            this.designLeftMHLen = inputData;
        } else if (inputDataType === "RightMHlen") {
            inputData = parseInt(inputData);
            this.designRightMHLen = inputData;
        } else if (inputDataType === "MHMethod") {
            var valuelist = ["C-insertion", "codon-deletion", "direct"];
            if (!valuelist.includes(inputData)) {
                throw new Error("MHMethod requires only : \"C-insertion\" or \"codon-deletion\" or \"direct\"");
            }
            this.designMHmethod = inputData;
        } else if (inputDataType === "PrimerType") {
            var valuelist = ["EGFP2APuroR", "CMV-EGFP2APuroR", "UserSet"];
            if (!valuelist.includes(inputData)) {
                throw new Error("PrimerType requires only : \"EGFP2APuroR\" or \"CMV-EGFP2APuroR\" or \"UserSet\"");
            }
            this.designPrimerType = inputData;
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
};

/**
 * Check method setting.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} hasAll (true:All setting is ok./false:not ok.)
 */
designCRISPITCh.prototype.hasMethod = function() {
    var hasAll = false;
    try {
        if (typeof this.inputPAMpattarray === "undefined") {
            throw new Error("this.inputPAMpattarray is 'undefined':" + this.inputPAMpattarray);
        } else if (typeof this.designLeftMHLen === "undefined") {
            throw new Error("this.designLeftMHLen is 'undefined':" + this.designLeftMHLen);
        } else if (typeof this.designRightMHLen === "undefined") {
            throw new Error("this.designRightMHLen is 'undefined':" + this.designRightMHLen);
        } else if (typeof this.designMHmethod === "undefined") {
            throw new Error("this.designMHmethod is 'undefined':" + this.designMHmethod);
        } else if (typeof this.designPrimerType === "undefined") {
            throw new Error("this.designPrimerType is 'undefined':" + this.designPrimerType);
        } else {
            hasAll = true;
        }
    } catch (e) {
        console.error(e);
    } finally {
        console.info("[Check] hasMethod() judge : " + hasAll);
        return hasAll;
    }
};

/**
 * Get the CRISPITCh design method
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {string} getDataType   Type of data
 * @return {?(string|Array|number)} returnedData  Gotten data
 */
designCRISPITCh.prototype.getMethod = function(getDataType) {
    var returnedData = null;
    try {
        if (getDataType === "PAM") {
            returnedData = this.inputPAMpattarray;
        } else if (getDataType === "LeftMHlen") {
            returnedData = this.designLeftMHLen;
        } else if (getDataType === "RightMHlen") {
            returnedData = this.designRightMHLen;
        } else if (getDataType === "MHMethod") {
            returnedData = this.designMHmethod;
        } else if (getDataType === "PrimerType") {
            returnedData = this.designPrimerType;
        } else {
            throw new Error("Undefined DataType or Getting feilture : " + getDataType);
        }
    } catch (e) {
        console.error(e);
    }
    return returnedData
};

/**
 * push primer to insert primer list
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param {object} sequencesSet       pushed sequences { primer : ...,vector : ... }
 * @param {("left"|"right")} direction       direction of sequencesSet
 * @return {number} The elements to add to the end of the array
 * generateIPrimer()の補助メソッド
 */
designCRISPITCh.prototype.pushIPrimer_ = function(sequencesSet, direction) {
    var lastElement = null;
    try {
        //引数の型を確認
        if (typeof sequencesSet !== 'object') {
            throw new Error("argument \"sequencesSet\" is wrong type : object argument required.");
        } else if ((direction !== "left") && (direction !== "right")) {
            throw new Error("argument \"direction\" is wrong : \"left\" or \"right\" required.");
        }
        //sequencesSet追加
        if (direction === "left") {
            lastElement = this.leftinsertSets.push(sequencesSet)
            console.info("[Set] this.leftinsertSets[" + (lastElement - 1) +
                "] : {" + this.leftinsertSets[lastElement - 1].primer +
                " , " + this.leftinsertSets[lastElement - 1].vector + "}");
        } else if (direction === "right") {
            lastElement = this.rightinsertSets.push(sequencesSet)
            console.info("[Set] this.rightinsertSets[" + (lastElement - 1) +
                "] : {" + this.rightinsertSets[lastElement - 1].primer +
                " , " + this.rightinsertSets[lastElement - 1].vector + "}");
        }
    } catch (e) {
        console.error(e);
    }
    return lastElement;
};

/**
 * generate primer for amplifying insert
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @return {array} The elements to add to the end of each primer ({leftlast, rightlast})
 */
designCRISPITCh.prototype.generateIPrimer = function() {
    //searching C or G base
    var countSetData = 0;
    var rightdesignedPos = 0;
    var leftdesignedPos = 0;
    var userinsertarray = this.retrieveData("userinsertarray");
    var insertLen = userinsertarray.length;
    //get primer have length of 17bp - 36bp.
    for (var primerlength = 16; primerlength <= 36; primerlength++) {
        //3'側検索(3revfore/3vectorrear)
        if (this.isCG_(userinsertarray[insertLen - 1 - primerlength])) {
            //primer設計
            var rightprimer = userinsertarray.slice(-primerlength).reverse();
            for (var i = 0; i < rightprimer.length; i++) {
                rightprimer[i] = this.getCompBase(rightprimer[i], "DNA")
            }
            var rightvector = userinsertarray.slice(-primerlength - 3);
            if (rightprimer.join("") === "") {
                console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + (userinsertarray.length - 1 - primerlength) + " - " + userinsertarray.length - 1);
                continue;
            } else {
                this.pushIPrimer_({ primer: rightprimer.join(""), vector: rightvector.join("") }, "right");
            }
        }
        //5'側検索(5fwdfore / 5vectorfore)
        if (this.isCG_(userinsertarray[primerlength])) {
            //primer設計
            var leftprimer = userinsertarray.slice(0, primerlength + 1);
            var leftvector = userinsertarray.slice(0, primerlength + 4);
            if (leftprimer.join("") === "" || leftvector.join("") === "") {
                console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + 0 + " - " + (primerlength + 4));
                continue;
            } else {
                this.pushIPrimer_({ primer: leftprimer.join(""), vector: leftvector.join("") }, "left");
            }
        }
    }
    return { leftlast: this.leftinsertSets.length, rightlast: this.rightinsertSets.length };
};

/**
 * retrieve insert primer in primer list
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param {number} setnum       index of sequences set
 * @param {string} direction       direction of primer ("left" | "right")
 * @return {object} insert sequences set
 */
designCRISPITCh.prototype.retrieveIPrimers = function(setnum, direction) {
    var returnedData = null;
    try {
        //引数の型を確認
        if (typeof setnum !== 'number') {
            throw new Error("argument \"setnum\" is wrong type : number object argument required.");
        } else if ((direction !== "left") && (direction !== "right")) {
            throw new Error("argument \"direction\" is wrong : \"left\" or \"right\" required.");
        }
        //primer追加
        if (direction === "left") {
            //未定義の場合はnull
            if (typeof this.leftinsertSets[setnum] === "undefined") {
                throw new Error("this.leftinsertSets[" + setnum + "] is undefined.");
            }
            returnedData = this.leftinsertSets[setnum]
        } else if (direction === "right") {
            //未定義の場合はnull
            if (typeof this.rightinsertSets[setnum] === "undefined") {
                throw new Error("this.rightinsertSets[" + setnum + "] is undefined.");
            }
            returnedData = this.rightinsertSets[setnum]
        }
    } catch (e) {
        console.error(e);
    }
    return returnedData;
};

/**
 * pick best primer about value of evaluation function
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.1
 * @param {function} valueFunc       evaluation function
 * @return {object} insert sequences set
 */
designCRISPITCh.prototype.pickIPrimers = function(valueFunc) {
    var returnedData = null;
    try {
        var leftvalue = [];
        var rightvalue = [];
        //evaluation
        for (var setindex in this.leftinsertSets) {
            leftvalue.push({ index: setindex, value: this.evalPrimerFunc(this.leftinsertSets[setindex].primer) });
        }
        for (var setindex in this.rightinsertSets) {
            rightvalue.push({ index: setindex, value: this.evalPrimerFunc(this.rightinsertSets[setindex].primer) });
        }
        //sorting
        var sortedleftvalue = this.sortObjarray(leftvalue, "value", "desc");
        var sortedrightvalue = this.sortObjarray(rightvalue, "value", "desc");
        //checking
        if (typeof sortedleftvalue === "undefined") {
            throw new Error("sortedleftvalue is undefined.");
        } else if (typeof sortedrightvalue === "undefined") {
            throw new Error("sortedrightvalue is undefined.");
        }
        //debug
        console.log({ left: sortedleftvalue, right: sortedrightvalue })
        returnedData = { left: sortedleftvalue[0], right: sortedrightvalue[0] };
    } catch (e) {
        console.error(e);
    }
    return returnedData;
};

/**
 * adjust primer set to fit user designed GOI
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @return {boolean} isSuccess       true:success|false:failture
 */
designCRISPITCh.prototype.adjUserdesign = function() {
    var isSuccess = false;
    try {
        //generate Primer
        var designedNum = this.generateIPrimer();
        //debug
        console.log(this.leftinsertSets);
        console.log(this.rightinsertSets);
        //check primer
        if (designedNum.leftlast < 1) {
            throw new Error("Left insert primer can't be designed.");
        } else if (designedNum.rightlast < 1) {
            throw new Error("Right insert primer can't be designed.");
        }
        //pick best primer
        var bestSeqList = this.pickIPrimers(this.evalPrimerFunc)
        if (bestSeqList.left.value === -Infinity || bestSeqList.right.value === -Infinity) {
            throw new Error("insert primer can't be accepted.");
        }
        var leftindex = Number(bestSeqList.left.index);
        var rightindex = Number(bestSeqList.right.index);
        //set best primer
        this.loadedSeqList.UserSet["5fwdfore"] = this.retrieveIPrimers(leftindex, "left").primer;
        this.loadedSeqList.UserSet["3revfore"] = this.retrieveIPrimers(rightindex, "right").primer;
        this.loadedSeqList.UserSet["5vectorfore"] = this.retrieveIPrimers(leftindex, "left").vector;
        this.loadedSeqList.UserSet["3vectorrear"] = this.retrieveIPrimers(rightindex, "right").vector;
        console.info(
            "[Set] " + "5fwdfore" + " : " + this.loadedSeqList.UserSet["5fwdfore"] + "\n" +
            "[Set] " + "3revfore" + " : " + this.loadedSeqList.UserSet["3revfore"] + "\n" +
            "[Set] " + "5vectorfore" + " : " + this.loadedSeqList.UserSet["5vectorfore"] + "\n" +
            "[Set] " + "3vectorrear" + " : " + this.loadedSeqList.UserSet["3vectorrear"]
        );
        isSuccess = true;
    } catch (e) {
        console.error(e);
        isSuccess = false;
    } finally {
        return isSuccess;
    }
};

/**
 * Enter the CRISPITCh design result
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string|number} inputData Setting value
 * @param {string} inputDataType   Type of data
 * @param {number} designedDraftNo id number in design dataset
 * @return {boolean} isSuccess       true:success|false:failture
 */
designCRISPITCh.prototype.setDesign = function(inputData, inputDataType, designedDraftNo) {
    var isSuccess = false;
    try {
        if (inputDataType === "DraftMaxNum") {
            this.designedDraftMaxNum = inputData;
        } else if (inputDataType === "Direction") {
            this.designedDirection[designedDraftNo] = inputData;
        } else if (inputDataType === "PAMendPos") {
            this.designedPAMendPos[designedDraftNo] = inputData;
        } else if (inputDataType === "gRNAendPos") {
            this.designedgRNAendPos[designedDraftNo] = inputData;
        } else if (inputDataType === "CutPos") {
            this.designedCutPos[designedDraftNo] = inputData;
        } else {
            throw new Error("Undefined DataType : " + inputDataType);
        }
        console.info("[Set] " + inputDataType + " [" + designedDraftNo + "] : " + inputData);
        isSuccess = true;
    } catch (e) {
        console.error(e);
        isSuccess = false;
    } finally {
        return isSuccess;
    }
};

/**
 * Clear the CRISPITCh design result
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @return {boolean} true:success|false:failture
 */
designCRISPITCh.prototype.clearDesign = function() {
    var isSuccess = false;
    this.designedDraftMaxNum = null;
    for (var pointDelDraft = 0, len = this.designedDirection.length; pointDelDraft < len; pointDelDraft++) {
        this.designedDirection[pointDelDraft] = null;
        this.designedPAMendPos[pointDelDraft] = null;
        this.designedgRNAendPos[pointDelDraft] = null;
        this.designedCutPos[pointDelDraft] = null;
        this.outerleftgenomeprimers = [];
        this.outerrightgenomeprimers = [];
        this.innerleftgenomeprimers = [];
        this.innerrightgenomeprimers = [];
    }
    isSuccess = true;
    return isSuccess;
};

/**
 * Getter of the CRISPITCh design result(private method)
 *  : This method is private method. The public getter method is retrieveDesign().
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   Type of data
 * @param {number} designedDraftNo id number in design dataset
 * @return {?(string|number)} returnedData  gotten data
 * @todo Implement default value of DraftMaxNum.
 */
designCRISPITCh.prototype.getDesign_ = function(getDataType, designedDraftNo) {
    var returnedData = null;
    if ((getDataType === "DraftMaxNum") && (typeof this.designedDirection !== "undefined")) {
        //getDataType:"DraftMaxNum" is not Array object.So "designedDraftNo" is not necessary.
        returnedData = this.designedDraftMaxNum;
    } else if ((getDataType === "Direction") && (typeof this.designedDirection !== "undefined")) {
        returnedData = this.designedDirection[designedDraftNo];
    } else if ((getDataType === "PAMendPos") && (typeof this.designedPAMendPos !== "undefined")) {
        returnedData = this.designedPAMendPos[designedDraftNo];
    } else if ((getDataType === "gRNAendPos") && (typeof this.designedgRNAendPos !== "undefined")) {
        returnedData = this.designedgRNAendPos[designedDraftNo];
    } else if ((getDataType === "CutPos") && (typeof this.designedgRNAendPos !== "undefined")) {
        returnedData = this.designedCutPos[designedDraftNo];
    }
    return returnedData;
};

/**
 * Make CRISPITCh design based on setting (private method)
 *  : This method is private method. The public getter method is retrieveDesign().
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {string} makeDataType    Type of data
 * @param {number} designedDraftNo id number in design dataset
 * @return {?(string|Array|number)} returnedData    made data
 */
designCRISPITCh.prototype.makeDesign_ = function(makeDataType, designedDraftNo) {
    var returnedData = null;
    if (makeDataType === "gRNAbindingarray") {
        if (this.designedDirection[designedDraftNo] === "plus") {
            returnedData = this.retrieveData("sequencearray").slice(
                this.designedgRNAendPos[designedDraftNo] + 1, this.designedPAMendPos[designedDraftNo] + 1
            );
        } else if (this.designedDirection[designedDraftNo] === "minus") {
            returnedData = this.retrieveData("sequencearray").slice(
                this.designedPAMendPos[designedDraftNo], this.designedgRNAendPos[designedDraftNo]
            );
        }
    } else if (makeDataType === "pU6gRNAsense") { //for constructing pU6-sgRNA expression vector
        //get protospacer N20
        var gRNAseq = null;
        if (this.designedDirection[designedDraftNo] === "plus") {
            gRNAseq = this.retrieveDesign("gRNAbindingarray", designedDraftNo);
            returnedData = gRNAseq.slice(0, -3);
        } else if (this.designedDirection[designedDraftNo] === "minus") {
            gRNAseq = this.retrieveDesign("gRNAbindingarray", designedDraftNo);
            var revcompgRNAarray = gRNAseq.reverse()
            for (var i = 0; i < revcompgRNAarray.length; i++) {
                revcompgRNAarray[i] = this.getCompBase(revcompgRNAarray[i], "DNA")
            }
            gRNAseq = revcompgRNAarray;
            returnedData = gRNAseq.slice(0, -3);
        }
        //add 5'- CACC(G) -
        if (gRNAseq[0] === "G") {
            returnedData = ["C", "A", "C", "C"];
            Array.prototype.push.apply(returnedData, gRNAseq.slice(0, -3));
        } else {
            returnedData = ["C", "A", "C", "C", "G"];
            Array.prototype.push.apply(returnedData, gRNAseq.slice(0, -3));
        }
    } else if (makeDataType === "pU6gRNAantisense") { //for constructing pU6-sgRNA expression vector
        var senceoligo = this.retrieveDesign("pU6gRNAsense", designedDraftNo);
        var antisenceoligo = senceoligo.reverse();
        for (var i = 0; i < antisenceoligo.length; i++) {
            antisenceoligo[i] = this.getCompBase(antisenceoligo[i], "DNA")
        }
        returnedData = ["A", "A", "A", "C"]
        Array.prototype.push.apply(returnedData, antisenceoligo.slice(0, -4));
    } else if (makeDataType === "LeftMHarray") {
        var startedPos = null;
        var endedPos = null;
        //codon-deletion pattern
        //選択部位のコドンを削除してmicrohomologyを構築
        if (this.designMHmethod === "codon-deletion") {
            endedPos = this.retrieveData("targetedPos") - this.retrieveData("remainedBaseNum");
            startedPos = endedPos - this.designLeftMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        } else if (this.designMHmethod === "C-insertion") {
            //C-insertion pattern
            //選択部位から次のコドンまでをCでうめてmicrohomologyを構築
            endedPos = this.retrieveData("targetedPos");
            startedPos = endedPos - this.designLeftMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
            for (var pushedCount = 0, len = (3 - this.retrieveData("remainedBaseNum")); pushedCount < len; pushedCount++) {
                returnedData.push("C");
            }
        } else if (this.designMHmethod === "direct") {
            //direct pattern
            //コドンを考慮することなく、targetpostionも含めたmicrohomologyを構築
            endedPos = this.retrieveData("targetedPos");
            startedPos = endedPos - this.designLeftMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        }
        //ドナー側のコドン調整（EGFP2APuroR または CMV-EGFP2APuroR カセットでのみ調整）
        if ((this.designPrimerType === "EGFP2APuroR") || (this.designPrimerType === "CMV-EGFP2APuroR")) {
            returnedData.push("C");
        }
    } else if (makeDataType === "LeftMHarrayOnly") { //5'末の補正塩基がない純粋な左マイクロホモロジー配列
        var startedPos = null;
        var endedPos = null;
        //codon-deletion pattern
        //選択部位のコドンを削除してmicrohomologyを構築
        if (this.designMHmethod === "codon-deletion") {
            endedPos = this.retrieveData("targetedPos") - this.retrieveData("remainedBaseNum");
            startedPos = endedPos - this.designLeftMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        } else if (this.designMHmethod === "C-insertion" || this.designMHmethod === "direct") {
            //C-insertion pattern
            //選択部位から次のコドンまでをCでうめてmicrohomologyを構築
            //direct pattern
            //コドンを考慮することなく、targetpostionも含めたmicrohomologyを構築
            endedPos = this.retrieveData("targetedPos");
            startedPos = endedPos - this.designLeftMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        }
    } else if (makeDataType === "RightMHarray") {
        var startedPos = null;
        var endedPos = null;
        //codon-deletion pattern
        if (this.designMHmethod === "codon-deletion") {
            startedPos = this.retrieveData("targetedPos") + (3 - this.retrieveData("remainedBaseNum"));
            endedPos = startedPos + this.designRightMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        } else if (this.designMHmethod === "C-insertion") {
            //C-insertion pattern
            startedPos = this.retrieveData("targetedPos") + (3 - this.retrieveData("remainedBaseNum"));
            endedPos = startedPos + this.designRightMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        } else if (this.designMHmethod === "direct") {
            //direct pattern
            startedPos = this.retrieveData("targetedPos");
            endedPos = startedPos + this.designRightMHLen;
            returnedData = this.retrieveData("sequencearray").slice(startedPos, endedPos);
        }
    } else if (makeDataType === "Seq") {
        if (this.designMHmethod === "codon-deletion" || this.designMHmethod === "C-insertion") {
            returnedData = this.retrieveData("sequencearray").slice(
                this.retrieveData("targetedPos") - 48 - this.retrieveData("remainedBaseNum"), this.retrieveData("targetedPos") - 48 - this.retrieveData("remainedBaseNum") + 96
            );
        } else if (this.designMHmethod === "direct") {
            returnedData = this.retrieveData("sequencearray").slice(
                this.retrieveData("targetedPos") - 48, this.retrieveData("targetedPos") - 48 + 96
            );
        }
    } else if (makeDataType === "5fwdprimer") {
        var pushedForeSeq = this.loadedSeqList[this.designPrimerType]["5fwdfore"].split("");
        var pushedRearSeq = this.loadedSeqList[this.designPrimerType]["5fwdrear"].split("");
        Array.prototype.push.apply(pushedRearSeq, this.retrieveDesign('LeftMHarray', designedDraftNo));
        Array.prototype.push.apply(pushedRearSeq, pushedForeSeq);
        returnedData = pushedRearSeq;
    } else if (makeDataType === "5fwdprimerbind") {
        returnedData = this.loadedSeqList[this.designPrimerType]["5fwdfore"].split("");
    } else if (makeDataType === "5revprimer") {
        returnedData = this.loadedSeqList[this.designPrimerType]["5rev"].split("");
    } else if (makeDataType === "3fwdprimer") {
        returnedData = this.loadedSeqList[this.designPrimerType]["3fwd"].split("");
    } else if (makeDataType === "3revprimer") {
        var pushedForeSeq = this.loadedSeqList[this.designPrimerType]["3revfore"].split('');
        var pushedRearSeq = this.loadedSeqList[this.designPrimerType]["3revrear"].split('');
        var revcompRightMHarray = this.retrieveDesign('RightMHarray', designedDraftNo).reverse()
        for (var i = 0; i < revcompRightMHarray.length; i++) {
            revcompRightMHarray[i] = this.getCompBase(revcompRightMHarray[i], "DNA")
        }
        Array.prototype.push.apply(pushedRearSeq, revcompRightMHarray);
        Array.prototype.push.apply(pushedRearSeq, pushedForeSeq);
        returnedData = pushedRearSeq;
    } else if (makeDataType === "3revprimerbind") {
        returnedData = this.loadedSeqList[this.designPrimerType]["3revfore"].split('');
    } else if (makeDataType === "5vector") {
        var pushedForeSeq = this.loadedSeqList[this.designPrimerType]["5vectorfore"].split('');
        var pushedRearSeq = this.loadedSeqList[this.designPrimerType]["5vectorrear"].split('');
        Array.prototype.push.apply(pushedRearSeq, this.retrieveDesign('LeftMHarray', designedDraftNo));
        Array.prototype.push.apply(pushedRearSeq, pushedForeSeq);
        var returnedData = pushedRearSeq;
    } else if (makeDataType === "3vector") {
        var pushedForeSeq = this.loadedSeqList[this.designPrimerType]["3vectorfore"].split('');
        var pushedRearSeq = this.loadedSeqList[this.designPrimerType]["3vectorrear"].split('');
        Array.prototype.push.apply(pushedRearSeq, this.retrieveDesign('RightMHarray', designedDraftNo));
        Array.prototype.push.apply(pushedRearSeq, pushedForeSeq);
        returnedData = pushedRearSeq;
    } else if (makeDataType === "wholevector") {
        var returnedDataSeq = this.loadedVectorSeqList["5backbone"];
        returnedDataSeq = returnedDataSeq + this.retrieveDesign('LeftMHarray', designedDraftNo).join('');
        if (this.designPrimerType === "EGFP2APuroR") {
            returnedDataSeq = returnedDataSeq + this.loadedVectorSeqList["EGFP2APuroRinsert"];
        } else if (this.designPrimerType === "CMV-EGFP2APuroR") {
            returnedDataSeq = returnedDataSeq + this.loadedVectorSeqList["CMV-EGFP2APuroRinsert"];
        } else if (this.designPrimerType === "UserSet") {
            returnedDataSeq = returnedDataSeq + this.userInsert;
        };
        returnedDataSeq = returnedDataSeq + this.retrieveDesign('RightMHarray', designedDraftNo).join('');
        returnedDataSeq = returnedDataSeq + this.loadedVectorSeqList["3backbone"];
        returnedData = returnedDataSeq.split('');
    };
    return returnedData;
};

/**
 * Get CRISPITCh design (Public getter method)
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {string} getDataType   type of data
 * @param {number} designedDraftNo id number in design dataset
 * @return {?(string|Array|number)} returnedData  gotten or made data
 */
designCRISPITCh.prototype.retrieveDesign = function(getDataType, designedDraftNo) {
    var returnedData = null;
    try {
        returnedData = this.getDesign_(getDataType, designedDraftNo);
        if (returnedData === null) {
            returnedData = this.makeDesign_(getDataType, designedDraftNo);
            if (returnedData === null) {
                throw new Error("Undefined DataType or Getting feilture : " + getDataType);
            }
        }
    } catch (e) {
        console.error(e);
    }
    return returnedData;
};

/**
 * Check design result.
 * @author Kazuki Nakamae
 * @version 1.1
 * @since 1.0
 * @param {number} designedDraftNo id number in design dataset
 * @param {Array} exeptedDataList exception
 * @return {boolean} hasAll          (true:All setting is ok./false:not ok.)
 */
designCRISPITCh.prototype.hasAllDesign = function(designedDraftNo, exeptedDataList) {
    var hasAll = true;
    //Some console function changed to null function temporarily.
    var runningInBrowser = (typeof window !== 'undefined');
    var stockedLog, stockedWarn, stockedError;
    if (runningInBrowser) {
        stockedLog = window.console.log;
        stockedWarn = window.console.warn;
        stockedError = window.console.error;
        window.console.log = function(i) { return; };
        window.console.warn = function(i) { return; };
        window.console.error = function(i) { return; };
    }
    //Checking
    var checkedDataList = ["Direction", "PAMendPos", "gRNAendPos", "CutPos", "gRNAbindingarray", "LeftMHarray", "RightMHarray", "Seq", "5fwdprimer", "5revprimer", "3fwdprimer", "3revprimer", "5vector", "3vector"];
    //例外にはいっていないnullをもつデータを検索する。
    for (var pointedCheckedNum = 0, len = checkedDataList.length; pointedCheckedNum < len; pointedCheckedNum++) {
        if (this.retrieveDesign(checkedDataList[pointedCheckedNum], designedDraftNo) === null) {
            if (exeptedDataList.indexOf(checkedDataList[pointedCheckedNum]) == -1) {
                //For debug
                console.info(checkedDataList[pointedCheckedNum] + "[" + designedDraftNo + "] : " + this.retrieveDesign(checkedDataList[pointedCheckedNum], designedDraftNo));
                hasAll = false;
            }
        }
    }
    console.info("[Check] hasAllDesign() judge : " + hasAll);
    if (runningInBrowser) {
        window.console.log = stockedLog;
        window.console.warn = stockedWarn;
        window.console.error = stockedError;
    }
    return hasAll;
};

/**
 * Recognize PAM sequence
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {number} searchPos       search point on "sequencearray"
 * @param {string} designDirection Direction of gRNA sequences("plus":sence/"minus":antisence)
 * @return {boolean} isPAM           whether the point is PAM sequence
 * createDesign()の補助メソッド
 * searchPosをPAM5'末端としてPAM領域の塩基と合致するか調べる。
 */
designCRISPITCh.prototype.recognizePAM_ = function(searchPos, designDirection) {
    var isPAM = true;
    for (var pointPAMPos = 0, len = this.inputPAMpattarray.length; pointPAMPos < len; pointPAMPos++) {
        if ((designDirection === "plus") &&
            (!(this.isSameBase_(this.retrieveData("sequencearray")[searchPos + pointPAMPos], this.inputPAMpattarray[pointPAMPos]))) ||
            ((designDirection === "minus") &&
                (!(this.isSameBase_(this.getCompBase(this.retrieveData("sequencearray")[searchPos - pointPAMPos], "DNA"), this.inputPAMpattarray[pointPAMPos]))))
        ) {
            isPAM = false;
            break;
        }
    }
    return isPAM;
};

/**
 * search dgRNA for CRISPITCh
 * searching PAM 5' end is the point of searchPos.
 * searching range is from -6bp to +6bp.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {number} requestedDraftNum the required number of design
 * @return {boolean} hasgRNA whether sgRNA can design
 */
designCRISPITCh.prototype.createDesign = function(requestedDraftNum) {
    //The default arguments
    if (typeof requestedDraftNum === "undefined") {
        requestedDraftNum = 10000;
    }
    console.info("[Note] The maximum draft number : " + requestedDraftNum);
    var hasgRNA = false;
    //PAMの検索
    var countSetData = 0;
    for (var targetedPosDelta = 0; targetedPosDelta < 6; targetedPosDelta++) {
        //3'側検索
        if (this.recognizePAM_(this.inputtargetedPos + targetedPosDelta, "plus")) {
            //gRNA設計
            this.setDesign(this.inputtargetedPos + targetedPosDelta + this.inputPAMpattarray.length - 1, "PAMendPos", countSetData);
            this.setDesign("plus", "Direction", countSetData);
            this.setDesign(this.getDesign_("PAMendPos", countSetData) - this.inputPAMpattarray.length - 20, "gRNAendPos", countSetData);
            this.setDesign(this.inputtargetedPos + targetedPosDelta - 3, "CutPos", countSetData);
            if (this.hasAllDesign(countSetData, ["Seq"]) === true) {
                console.info("[Note] " + (countSetData + 1) + " Design is complete.");
                hasgRNA = true;
                this.setDesign(countSetData, "DraftMaxNum", countSetData);
                countSetData++;
                if (countSetData >= requestedDraftNum) {
                    break;
                }
            }
        }
        //5'側検索
        else if (this.recognizePAM_(this.inputtargetedPos - targetedPosDelta, "minus")) {
            //gRNA設計
            this.setDesign(this.inputtargetedPos - targetedPosDelta - (this.inputPAMpattarray.length - 1), "PAMendPos", countSetData);
            this.setDesign("minus", "Direction", countSetData);
            this.setDesign(this.getDesign_("PAMendPos", countSetData) + this.inputPAMpattarray.length + 20, "gRNAendPos", countSetData);
            this.setDesign(this.inputtargetedPos - targetedPosDelta + 3, "CutPos", countSetData);
            if (this.hasAllDesign(countSetData, ["Seq"]) === true) {
                console.info("[Note] " + (countSetData + 1) + " Design is complete.");
                hasgRNA = true;
                this.setDesign(countSetData, "DraftMaxNum", countSetData);
                countSetData++;
                if (countSetData >= requestedDraftNum) {
                    break;
                }
            }
        }
    }
    if (hasgRNA == false) {
        console.info("gRNA can not be designed.");
    }
    return hasgRNA;
};

/**
 * push primer to primer list
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param {string} sequencesSet       pushed sequencesSet
 * @param {?("outerleft" | "outerright"|"innerleft" | "innerright")} direction direction of sequencesSet
 * @return {number} The elements to add to the end of the array
 * generateGPrimer()の補助メソッド
 */
designCRISPITCh.prototype.pushGPrimer_ = function(sequencesSet, direction) {
    var lastElement = null;
    try {
        //引数の型を確認
        if (typeof sequencesSet !== 'object') {
            throw new Error("argument \"sequencesSet\" is wrong type : object argument required.");
        } else if ((direction !== "outerleft") && (direction !== "outerright") && (direction !== "innerleft") && (direction !== "innerright")) {
            throw new Error("argument \"direction\" is wrong : \"outerleft\" or \"outerright\" or \"innerleft\" or \"innerright\" required.");
        }
        //sequencesSet追加
        if (direction === "outerleft") {
            lastElement = this.outerleftgenomeprimers.push(sequencesSet)
                //console.info("[Set] this.outerleftgenomeprimers[" + (lastElement - 1) + "] : " + this.outerleftgenomeprimers[lastElement - 1]);
        } else if (direction === "outerright") {
            lastElement = this.outerrightgenomeprimers.push(sequencesSet)
                //console.info("[Set] this.outerrightgenomeprimers[" + (lastElement - 1) + "] : " + this.outerrightgenomeprimers[lastElement - 1]);
        } else if (direction === "innerleft") {
            lastElement = this.innerleftgenomeprimers.push(sequencesSet)
                //console.info("[Set] this.innerleftgenomeprimers[" + (lastElement - 1) + "] : " + this.innerleftgenomeprimers[lastElement - 1]);
        } else if (direction === "innerright") {
            lastElement = this.innerrightgenomeprimers.push(sequencesSet)
                //console.info("[Set] this.innerrightgenomeprimers[" + (lastElement - 1) + "] : " + this.innerrightgenomeprimers[lastElement - 1]);
        }
    } catch (e) {
        console.error(e);
    }
    return lastElement;
};

/**
 * get primer in primer list
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @param {number} primernum       index of primer
 * @param {?("outerleft" | "outerright"|"innerleft" | "innerright")} direction direction of primer
 * @return {object} primer sequences and distanse from target point
 */
designCRISPITCh.prototype.retrieveGPrimers = function(primernum, direction) {
    var returnedData = null;
    try {
        //引数の型を確認
        if (typeof primernum !== 'number') {
            throw new Error("argument \"primernum\" is wrong type : number object argument required.");
        } else if ((direction !== "outerleft") && (direction !== "outerright") && (direction !== "innerleft") && (direction !== "innerright")) {
            throw new Error("argument \"direction\" is wrong : \"outerleft\" or \"outerright\" or \"innerleft\" or \"innerright\" required.");
        }
        //primer追加
        if (direction === "outerleft") {
            //未定義の場合はnull
            if (typeof this.outerleftgenomeprimers[primernum] === "undefined") {
                throw new Error("this.outerleftgenomeprimers[" + primernum + "] is undefined.");
            }
            returnedData = this.outerleftgenomeprimers[primernum]
        } else if (direction === "outerright") {
            //未定義の場合はnull
            if (typeof this.outerrightgenomeprimers[primernum] === "undefined") {
                throw new Error("this.outerrightgenomeprimers[" + primernum + "] is undefined.");
            }
            returnedData = this.outerrightgenomeprimers[primernum]
        } else if (direction === "innerleft") {
            //未定義の場合はnull
            if (typeof this.innerleftgenomeprimers[primernum] === "undefined") {
                throw new Error("this.innerleftgenomeprimers[" + primernum + "] is undefined.");
            }
            returnedData = this.innerleftgenomeprimers[primernum]
        } else if (direction === "innerright") {
            //未定義の場合はnull
            if (typeof this.innerrightgenomeprimers[primernum] === "undefined") {
                throw new Error("this.innerrightgenomeprimers[" + primernum + "] is undefined.");
            }
            returnedData = this.innerrightgenomeprimers[primernum]
        }
    } catch (e) {
        console.error(e);
    }
    return returnedData;
};

/**
 * get all primer list
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @return {object} all primer sequences and distanse from target point list
 */
designCRISPITCh.prototype.retrieveAllGPrimers = function() {
    return {
        "outerleft": this.outerleftgenomeprimers,
        "outerright": this.outerrightgenomeprimers,
        "innerleft": this.innerleftgenomeprimers,
        "innerright": this.innerrightgenomeprimers
    };
}

/**
 * generate primer for genotyping
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.1
 * @return {array} The elements to add to the end of each primer ({outerleftlast, outerrightlast})
 */
designCRISPITCh.prototype.generateGPrimer = function() {
    //searching C or G base
    var countSetData = 0;
    var designedRMHlen = this.retrieveDesign("RightMHarray", 0).length;
    var designedLMHlen = this.retrieveDesign("LeftMHarray", 0).length;
    console.log("////////////////////////////////////////////////")
    console.log(designedRMHlen);
    console.log(designedLMHlen);
    console.log("////////////////////////////////////////////////")
    var outerrightdesignedPos = 0;
    var outerleftdesignedPos = 0;
    var innerrightdesignedPos = 0;
    var innerleftdesignedPos = 0;
    var remainedbase = this.retrieveData("remainedBaseNum");
    var targetarray = this.retrieveData("sequencearray");
    var insertarray;
    var adjustDelta; //adjustment for distance between primer and boundary TODO:find fomula
    if (this.getMethod("PrimerType") === "EGFP2APuroR") {
        insertarray = this.loadedVectorSeqList["EGFP2APuroRinsert"].split("");
        adjustDelta = 3;
    } else if (this.getMethod("PrimerType") === "CMV-EGFP2APuroR") {
        insertarray = this.loadedVectorSeqList["CMV-EGFP2APuroRinsert"].split("");
        adjustDelta = 3;
    } else if (this.getMethod("PrimerType") === "UserSet") {
        insertarray = this.retrieveData("userinsertarray");
        adjustDelta = 2;
    } else {
        console.error("unexpected ward in this.getMethod(\"PrimerType\")")
    }
    var delcodonbase = 0;
    if (this.getMethod("MHMethod") === "codon-deletion") {
        delcodonbase = 3;
    }
    //TODO no frame バージョンにも対応させる
    var targetLen = targetarray.length;
    var insertLen = insertarray.length;
    for (var designedPosDelta = 80; designedPosDelta <= 220; designedPosDelta++) { // this range including margin +-20
        var outerrightdesignedPos = (this.inputtargetedPos + designedRMHlen + designedPosDelta)
        var outerleftdesignedPos = (this.inputtargetedPos - designedLMHlen - designedPosDelta)
        var innerrightdesignedPos = (insertLen - 1 - designedPosDelta);
        var innerleftdesignedPos = designedPosDelta;
        //true designedpos
        var ORdesignedpos = designedPosDelta - 3 + remainedbase;
        var OLdesignedpos = designedPosDelta + adjustDelta - remainedbase - delcodonbase;
        var IRdesignedpos = designedPosDelta;
        var ILdesignedpos = designedPosDelta;

        if (outerrightdesignedPos >= 19) { //範囲チェック
            //3'外側検索
            if (this.isCG_(targetarray[outerrightdesignedPos]) && ORdesignedpos >= 100 && ORdesignedpos <= 200) {
                //primer設計
                for (var primerlength = 20; primerlength <= 36; primerlength++) {
                    var outerrightprimer = targetarray.slice(outerrightdesignedPos, outerrightdesignedPos + primerlength).reverse();
                    for (var i = 0; i < outerrightprimer.length; i++) {
                        outerrightprimer[i] = this.getCompBase(outerrightprimer[i], "DNA")
                    }
                    if (outerrightprimer.join("") === "") {
                        console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + outerrightdesignedPos + " - " + (outerrightdesignedPos + primerlength));
                        break;
                    } else {
                        this.pushGPrimer_({ primer: outerrightprimer.join(""), deltaend: ORdesignedpos }, "outerright");
                    }
                }
            }
        }
        if (outerleftdesignedPos < targetLen - 20) { //範囲チェック
            //5'外側検索
            if (this.isCG_(targetarray[outerleftdesignedPos]) && OLdesignedpos >= 100 && OLdesignedpos <= 200) {
                //primer設計
                for (var primerlength = 20; primerlength <= 36; primerlength++) {
                    var outerleftprimer = targetarray.slice(outerleftdesignedPos + 1 - primerlength, outerleftdesignedPos + 1);
                    if (outerleftprimer.join("") === "") {
                        console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + (outerleftdesignedPos - primerlength) + " - " + outerleftdesignedPos);
                        break;
                    } else {
                        this.pushGPrimer_({ primer: outerleftprimer.join(""), deltaend: OLdesignedpos }, "outerleft");
                    }
                }
            }
        }
        //インサートの範囲外になった場合はこれ以降の処理は行わない
        if (innerrightdesignedPos < 19) {
            continue;
        }
        //3'内側検索
        if (this.isCG_(insertarray[innerrightdesignedPos]) && IRdesignedpos >= 100 && IRdesignedpos <= 200) {
            //primer設計
            for (var primerlength = 20; primerlength <= 36; primerlength++) {
                var innerrightprimer = insertarray.slice(innerrightdesignedPos + 1 - primerlength, innerrightdesignedPos + 1);
                if (innerrightprimer.join("") === "") {
                    console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + innerrightdesignedPos + 1 - primerlength + " - " + (innerrightdesignedPos + 1));
                    continue;
                } else {
                    this.pushGPrimer_({ primer: innerrightprimer.join(""), deltaend: IRdesignedpos }, "innerright");
                }
            }
        }
        //5'内側検索
        if (this.isCG_(insertarray[innerleftdesignedPos]) && ILdesignedpos >= 100 && ILdesignedpos <= 200) {
            //primer設計
            for (var primerlength = 20; primerlength <= 36; primerlength++) {
                var innerleftprimer = insertarray.slice(innerleftdesignedPos, innerleftdesignedPos + primerlength).reverse();
                for (var i = 0; i < innerleftprimer.length; i++) {
                    innerleftprimer[i] = this.getCompBase(innerleftprimer[i], "DNA")
                }
                if (innerleftprimer.join("") === "") {
                    console.warn("[Warning] getting sequences is failed. illegal region may be refered. ; range : " + innerleftdesignedPos + " - " + (innerleftdesignedPos + primerlength));
                    break;
                } else {
                    this.pushGPrimer_({ primer: innerleftprimer.join(""), deltaend: ILdesignedpos }, "innerleft");
                }
            }
        }
    }
    return { outerleftlast: this.outerleftgenomeprimers.length, outerrightlast: this.outerrightgenomeprimers.length, innerleftlast: this.innerleftgenomeprimers.length, innerrightlast: this.innerrightgenomeprimers.length };
};

//debug mode

if (false) {
    //var test = new designCRISPITCh(
    //    //title
    //    "AAVS1",
    //    //target sequence
    //    "GAATTCCTAACTGCCCCGGGGCAGTCTGCTATTCATCCCCTTTACGCGGTGCTACACACACTTGCTAGTATGCCGTGGGGACCCCTCCGGCCTGTAGACTCCATTTCCCAGCATTCCCCGGAGGAGGCCCTCATCTGGCGATTTCCACTGGGGGCCTCGGAGCTGCGGACTTCCCAGTGTGCATCGGGGCACAGCGACTCCTGGAAGTGGCCACTTCTGCTAATGGACTCCATTTCCCAGGCTCCCGCTACCTGCCCAGCACACCCTGGGGCATCCGTGACGTCAGCAAGCCGGGCGGGGACCGGAGATCCTTGGGGCGGTGGGGGGCCAGCGGCAGTTCCCAGGCGGCCCCCGGGGCGGGCGGGCGGGCGGGTGGTGGCGGCGGTTGGGGCTCCGGGCGCGTCGCTCGCTCGCTCGCTGGGCGGGCGGGCGGTGCGATGTCCGGAGAGGATGGCCGGCGGCTGGCCCGGGGGCGGCGGCGCGGCTGCCCGGGAGCGGCGACGGGAGCAGCTGCGGCAGTGGGGCGCGGGCGGGCGCCGAGCCTGGCCCCGGAGAGCGCC",
    //    //reading frame(0-2)
    //    0,
    //    //target position
    //    150
    //);
    //test.setMethod("EGFP2APuroR", "PrimerType");
    //test.setMethod("CMV-EGFP2APuroR", "PrimerType");
    //test.setData("AATAAAAAAAAAAAAAAAGCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGCAAAAAAAAAAAAAAAAGA", "userInsert");
    //console.log("userInsert : " + test.retrieveData("userInsert"));
    //console.log("evalPrimerFunc : " + test.retrieveData("evalPrimerFunc"));
    //test.createDesign();
    //console.log("5fwdprimer : " + test.retrieveDesign("5fwdprimer", 0));
    //console.log("5revprimer : " + test.retrieveDesign("5revprimer", 0));
    //console.log("3fwdprimer : " + test.retrieveDesign("3fwdprimer", 0));
    //console.log("3revprimer : " + test.retrieveDesign("3revprimer", 0));
    //console.log("wholevector : " + test.retrieveDesign("wholevector", 0).join(''));
    //テスト完了、この評価関数をoligotm()にしてmain.js上で動かす。
    //その前に評価関数もコンストラクタに設定できるようにする。またプライマーの設計とセットはコンストラクタ時点で自動化させておく
    //これはcreateDesign()以外に必要なメソッドを増やすと順序によって動作が異なってしまうためである。それは適切ではない。
    //test.setMethod("UserSet", "PrimerType");
    //test.createDesign();
    /*
    test.generateGPrimer();
    console.log(test.retrieveGPrimers(0, "outerleft"));
    console.log(test.retrieveGPrimers(1, "outerleft"));
    console.log(test.retrieveGPrimers(0, "outerright"));
    console.log(test.retrieveGPrimers(1, "outerright"));
    console.log(test.retrieveGPrimers(0, "innerleft"));
    console.log(test.retrieveGPrimers(1, "innerleft"));
    console.log(test.retrieveGPrimers(0, "innerright"));
    console.log(test.retrieveGPrimers(1, "innerright"));
    console.log(test.retrieveAllGPrimers());
    */
    //console.log("leftprimer" + test.retrieveGPrimers(0, "left"))
    //console.log("rightprimer" + test.retrieveGPrimers(0, "right"))
    //console.log("5fwdprimer" + test.retrieveDesign("5fwdprimer", 0).join(""))
    //console.log("5revprimer" + test.retrieveDesign("5revprimer", 0).join(""))
    //console.log("3fwdprimer" + test.retrieveDesign("3fwdprimer", 0).join(""))
    //console.log("3revprimer" + test.retrieveDesign("3revprimer", 0).join(""))
    //console.log("5vector" + test.retrieveDesign("5vector", 0).join(""))
    //console.log("3vector" + test.retrieveDesign("3vector", 0).join(""))
    //console.log("sgRNA direction : " + test.retrieveDesign("Direction", 0))
    //console.log("sgRNA : " + test.retrieveDesign("gRNAbindingarray", 0))
    //console.log("senseoligo : " + test.retrieveDesign("pU6gRNAsense", 0))
    //console.log("antisenseoligo : " + test.retrieveDesign("pU6gRNAantisense", 0))
    //console.log("sgRNA direction : " + test.retrieveDesign("Direction", 1))
    //console.log("sgRNA : " + test.retrieveDesign("gRNAbindingarray", 1))
    //console.log("senseoligo : " + test.retrieveDesign("pU6gRNAsense", 1))
    //console.log("antisenseoligo : " + test.retrieveDesign("pU6gRNAantisense", 1))
    //console.log("sgRNA direction : " + test.retrieveDesign("Direction", 2))
    //console.log("sgRNA : " + test.retrieveDesign("gRNAbindingarray", 2))
    //console.log("senseoligo : " + test.retrieveDesign("pU6gRNAsense", 2))
    //console.log("antisenseoligo : " + test.retrieveDesign("pU6gRNAantisense", 2))
    //var test2 = new designCRISPITCh(
    //    //title
    //    "AAVS1",
    //    //target sequence
    //    "GAATTCCTAACTGCCCCGGGGCAGTCTGCTATTCATCCCCTTTACGCGGTGCTACACACACTTGCTAGTATGCCGTGGGGACCCCTCCGGCCTGTAGACTCCATTTCCCAGCATTCCCCGGAGGAGGCCCTCATCTGGCGATTTCCACTGGGGGCCTCGGAGCTGCGGACTTCCCAGTGTGCATCGGGGCACAGCGACTCCTGGAAGTGGCCACTTCTGCTAATGGACTCCATTTCCCAGGCTCCCGCTACCTGCCCAGCACACCCTGGGGCATCCGTGACGTCAGCAAGCCGGGCGGGGACCGGAGATCCTTGGGGCGGTGGGGGGCCAGCGGCAGTTCCCAGGCGGCCCCCGGGGCGGGCGGGCGGGCGGGTGGTGGCGGCGGTTGGGGCTCCGGGCGCGTCGCTCGCTCGCTCGCTGGGCGGGCGGGCGGTGCGATGTCCGGAGAGGATGGCCGGCGGCTGGCCCGGGGGCGGCGGCGCGGCTGCCCGGGAGCGGCGACGGGAGCAGCTGCGGCAGTGGGGCGCGGGCGGGCGCCGAGCCTGGCCCCGGAGAGCGCC",
    //    //reading frame(0-2)
    //    0,
    //    //target position
    //    350
    //);
    //test2.createDesign();
    //console.log("sgRNA direction : " + test2.retrieveDesign("Direction", 0))
    //console.log("sgRNA : " + test2.retrieveDesign("gRNAbindingarray", 0))
    //console.log("senseoligo : " + test2.retrieveDesign("pU6gRNAsense", 0))
    //console.log("antisenseoligo : " + test2.retrieveDesign("pU6gRNAantisense", 0))
    //console.log("sgRNA direction : " + test2.retrieveDesign("Direction", 1))
    //console.log("sgRNA : " + test2.retrieveDesign("gRNAbindingarray", 1))
    //console.log("senseoligo : " + test2.retrieveDesign("pU6gRNAsense", 1))
    //console.log("antisenseoligo : " + test2.retrieveDesign("pU6gRNAantisense", 1))
    //console.log("sgRNA direction : " + test2.retrieveDesign("Direction", 2))
    //console.log("sgRNA : " + test2.retrieveDesign("gRNAbindingarray", 2))
    //console.log("senseoligo : " + test2.retrieveDesign("pU6gRNAsense", 2))
    //console.log("antisenseoligo : " + test2.retrieveDesign("pU6gRNAantisense", 2))
    /*
    var test3 = new designCRISPITCh(
        //title
        "AAVS1",
        //target sequence
        "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        //reading frame(0-2)
        0,
        //target position
        250
    );
    test3.setData("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", "userInsert");
    test3.setMethod("UserSet", "PrimerType");
    test3.createDesign();
    test3.generateGPrimer();
    console.log(test3.retrieveAllGPrimers());
    var primerslist = test3.retrieveAllGPrimers();
    for (var primer of primerslist.innerleft) {
        if ((primer.deltaend <= 105 || primer.deltaend >= 195) && primer.primer)
            console.log(primer.deltaend);
    }
    */
}