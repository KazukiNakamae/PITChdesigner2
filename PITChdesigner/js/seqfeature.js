/**
 * @version 1.0
 * update date 2023/1/5
 * 
 */
"use strict";

//function//////////////////////////////////////////////////////////////////////
//check 
if (typeof getUndesirableFeature !== "undefined") {
  console.warn("[Warn] seqfeature library defines newly getUndesirableFeature() at global scope level.")
}
/**
* @description Get Undesirable Feature for MMEJ knock-in
* @function getUndesirableFeature
* @author Kazuki Nakamae
* @version 1.0
* @since 1.0
* @param {string} direction gRNA direction ("plus" or "minus")
* @param {string} target_seq gRNAbindingarray sequence (protospacer + PAM)
*/
var getUndesirableFeature = function(direction, target_seq) {
  // Check arguments
  if((direction !== "plus") && (direction !== "minus")){
    console.error("unexpected ward in direction argument of getUndesirableFeature function")
  };
  if (typeof target_seq !== 'string') {
    console.error("unexpected type of target_seq argument of getUndesirableFeature function")
  };

  var found_annotations = "";
  var pam_distal_base = "";
  var is_dinuc_adj_cut_site = false;
  var is_16c = false;
  var is_17c = false;
  var is_18c = false;
  var is_19c = false;
  // Feature: the PAM-distal T nucleotide (cauae +1 bp InDel)
  if(direction === "plus"){
    pam_distal_base = target_seq.slice(16, 17);
    if(pam_distal_base === "T"){
      found_annotations = found_annotations.concat("The PAM-distal T nucleotide in the plus strand, ");
    }
  }else if(direction === "minus"){
    pam_distal_base = target_seq.slice(6, 7);
    if(pam_distal_base === "A"){
      found_annotations = found_annotations.concat("The PAM-distal T nucleotide in the plus strand, ");
    }
  };
    // Feature: CC Dinucleotide on at the cut site (cauae MMEJ-assisted InDel without intervening sequence)
    if(direction === "plus"){
      is_16c = (target_seq.slice(15, 16) === "C")
      is_17c = (target_seq.slice(16, 17) === "C")
      is_18c = (target_seq.slice(17, 18) === "C")
      is_19c = (target_seq.slice(18, 19) === "C")
      if(is_16c && is_17c){
        found_annotations = found_annotations.concat("The PAM-distal CC dinucleotide in the plus strand, ");
      }
      if(is_17c && is_18c){
        found_annotations = found_annotations.concat("The CC dinucleotide on both bases adjacent to the cut site, ");
      };
      if(is_18c && is_19c){
        found_annotations = found_annotations.concat("The PAM-proximal CC dinucleotide in the plus strand, ");
      };
    }else if(direction === "minus"){
      is_19c = (target_seq.slice(4, 5) === "G")
      is_18c = (target_seq.slice(5, 6) === "G")
      is_17c = (target_seq.slice(6, 7) === "G")
      is_16c = (target_seq.slice(7, 8) === "G")
      if(is_16c && is_17c){
        found_annotations = found_annotations.concat("The PAM-distal CC dinucleotide in the plus strand, ");
      }
      if(is_17c && is_18c){
        found_annotations = found_annotations.concat("The CC dinucleotide on both bases adjacent to the cut site, ");
      };
      if(is_18c && is_19c){
        found_annotations = found_annotations.concat("The PAM-proximal CC dinucleotide in the plus strand, ");
      };
    };

  /** Careful, but it is not valid criteria
  // Feature: Dinucleotide on both bases adjacent to the cut site (cauae MMEJ-assisted InDel without intervening sequence)
  if(direction === "plus"){
    var is_dinuc_adj_cut_site = (target_seq.slice(16, 17) === target_seq.slice(17, 18));
    if(is_dinuc_adj_cut_site){
      found_annotations = found_annotations.concat("The dinucleotide on both bases adjacent to the cut site, ");
    };
  }else if(direction === "minus"){
    var is_dinuc_adj_cut_site = (target_seq.slice(5, 6) === target_seq.slice(6, 7));
    if(is_dinuc_adj_cut_site){
      found_annotations = found_annotations.concat("The dinucleotide on both bases adjacent to the cut site, ");
    };
  };

  // Feature: TA|TA / AG|AG / TG/TG | CG|CG | TC|TC dinucleotide repeat at the cut site (cauae dominant 2 bp MMEJ-assisted InDel)
  if(direction === "plus"){
    pam_distal_dinuleotide = target_seq.slice(15, 17);
    pam_proximal_dinuleotide = target_seq.slice(17, 19);
    is_same_pam_distal_dinuleotide = (pam_distal_dinuleotide === pam_proximal_dinuleotide);
    if(is_same_pam_distal_dinuleotide){
      if(pam_distal_dinuleotide === "TA"){
        found_annotations = found_annotations.concat("The TA|TA dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "AG"){
        found_annotations = found_annotations.concat("The AG|AG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "TG"){
        found_annotations = found_annotations.concat("The TG|TG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "CG"){
        found_annotations = found_annotations.concat("The CG|CG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "TC"){
        found_annotations = found_annotations.concat("The TC|TC dinucleotide repeat at the cut site of plus strand, ");
      };
    };
  }else if(direction === "minus"){
    pam_distal_dinuleotide = target_seq.slice(4, 6);
    pam_proximal_dinuleotide = target_seq.slice(6, 8);
    is_same_pam_distal_dinuleotide = (pam_distal_dinuleotide === pam_proximal_dinuleotide);
    if(is_same_pam_distal_dinuleotide){
      if(pam_distal_dinuleotide === "TA"){
        found_annotations = found_annotations.concat("The TA|TA dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "CT"){
        found_annotations = found_annotations.concat("The AG|AG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "CA"){
        found_annotations = found_annotations.concat("The TG|TG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "CG"){
        found_annotations = found_annotations.concat("The CG|CG dinucleotide repeat at the cut site of plus strand, ");
      }else if(pam_distal_dinuleotide === "GA"){
        found_annotations = found_annotations.concat("The TC|TC dinucleotide repeat at the cut site of plus strand, ");
      };
    };
  };
  */

  if(found_annotations === ""){
    return "None";
  }else{
    // Remove ","
    return found_annotations.slice(0, -2);
  };
};

//check
if (typeof getUndesirableFeature !== "undefined") {
  console.info("[Info] getUndesirableFeature() is defined at global scope level.")
}



//check 
if (typeof getDesirableFeature !== "undefined") {
  console.warn("[Warn] seqfeature library defines newly getDesirableFeature() at global scope level.")
}
/**
* @description Get Desirable Feature for MMEJ knock-in
* @function getDesirableFeature
* @author Kazuki Nakamae
* @version 1.0
* @since 1.0
* @param {string} direction gRNA direction ("plus" or "minus")
* @param {string} target_seq gRNAbindingarray sequence (protospacer + PAM)
*/
var getDesirableFeature = function(direction, target_seq) {
  // Check arguments
  if((direction !== "plus") && (direction !== "minus")){
    console.error("unexpected ward in direction argument of getDesirableFeature function")
  };
  if (typeof target_seq !== 'string') {
    console.error("unexpected type of target_seq argument of getDesirableFeature function")
  };
  var found_annotations = "";
  var pam_distal_base = "";
  // Feature: the PAM-distal T nucleotide (cauae +1 bp InDel)
  if(direction === "plus"){
    pam_distal_base = target_seq.slice(16, 17);
    if(pam_distal_base === "G"){
      found_annotations = found_annotations.concat("The PAM-distal G nucleotide in the plus strand, ");
    }
  }else if(direction === "minus"){
    pam_distal_base = target_seq.slice(6, 7);
    if(pam_distal_base === "C"){
      found_annotations = found_annotations.concat("The PAM-distal G nucleotide in the plus strand, ");
    }
  };

  if(found_annotations === ""){
    return "None";
  }else{
    // Remove ","
    return found_annotations.slice(0, -2);
  };
};
//check
if (typeof getDesirableFeature !== "undefined") {
  console.info("[Info] getDesirableFeature() is defined at global scope level.")
}


/**
// For Debug
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAATACTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAAAACTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAATATATTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAAGAGTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAATGTGTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAACGCGTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAATCTCTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAATTTCTTGG"));
console.log(getUndesirableFeature("plus", "AAAAAAAAAAAAAAAACAAAAGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAACCGGTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAGCCGTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAGGCCTTGG"));
console.log(getUndesirableFeature("plus", "CGTAGAAAGTAATAAGCCCTTGG"));

console.log(getUndesirableFeature("minus", "CCAAGTATTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAAGTTTTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAATATATTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAACTCTTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAACACATTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAACGCGTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAAGAGATTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAAGAAATTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCTTTTGTTTTTTTTTTTTTTTT"));
console.log(getUndesirableFeature("minus", "CCAACCGGTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAACGGCTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAAGGCCTTATTACTTTCTACG"));
console.log(getUndesirableFeature("minus", "CCAAGGGCTTATTACTTTCTACG"));

// For Manual Evaluation
// 50 KI

console.log("ACCCCACAGTGGGGCCACTA")
console.log(getUndesirableFeature("plus", "ACCCCACAGTGGGGCCACTA"));
console.log("TAGTCCAGGACCTTTGCCTC")
console.log(getUndesirableFeature("plus", "TAGTCCAGGACCTTTGCCTC"));
console.log("TGGATGAAGCCCCGCGCGCG")
console.log(getUndesirableFeature("plus", "TGGATGAAGCCCCGCGCGCG"));
console.log("GTCCGACCCTGGATGCCAAT")
console.log(getUndesirableFeature("plus", "GTCCGACCCTGGATGCCAAT"));
console.log("TGAAGAGCATTCATCGTGAG")
console.log(getUndesirableFeature("plus", "TGAAGAGCATTCATCGTGAG"));
console.log("TCTAGCACAACTATGTTGTC")
console.log(getUndesirableFeature("plus", "TCTAGCACAACTATGTTGTC"));
console.log("GACAAGCAAGCCGTGCTTTC")
console.log(getUndesirableFeature("plus", "GACAAGCAAGCCGTGCTTTC"));
console.log("TGTAGGGCGCCCACATCAGA")
console.log(getUndesirableFeature("plus", "TGTAGGGCGCCCACATCAGA"));
console.log("CTTATCCTTACTGAACTGTG")
console.log(getUndesirableFeature("plus", "CTTATCCTTACTGAACTGTG"));
console.log("GGTCAAGAACTACAATCCCT")
console.log(getUndesirableFeature("plus", "GGTCAAGAACTACAATCCCT"));
console.log("ATACCTTGTGCTCATTGTAG")
console.log(getUndesirableFeature("plus", "ATACCTTGTGCTCATTGTAG"));
console.log("TACCGGGCAGTCAGCGGTCC")
console.log(getUndesirableFeature("plus", "TACCGGGCAGTCAGCGGTCC"));
console.log("ATCAACAATACCTCGATAGA")
console.log(getUndesirableFeature("plus", "ATCAACAATACCTCGATAGA"));
console.log("TTCACGGAAACCCGTTGACT")
console.log(getUndesirableFeature("plus", "TTCACGGAAACCCGTTGACT"));
console.log("GAAACGATGTTGCAGACTTT")
console.log(getUndesirableFeature("plus", "GAAACGATGTTGCAGACTTT"));
console.log("TGCCGCCCCACGTGCGCATC")
console.log(getUndesirableFeature("plus", "TGCCGCCCCACGTGCGCATC"));
console.log("CACTTTCATGGAGGCGGTGA")
console.log(getUndesirableFeature("plus", "CACTTTCATGGAGGCGGTGA"));
console.log("CCGAGTGCCGCCATCCCAAT")
console.log(getUndesirableFeature("plus", "CCGAGTGCCGCCATCCCAAT"));
console.log("GCTCTCCCAGCCGTCCGACC")
console.log(getUndesirableFeature("plus", "GCTCTCCCAGCCGTCCGACC"));
console.log("GTGCTGAGCGGAGCCCGGAC")
console.log(getUndesirableFeature("plus", "GTGCTGAGCGGAGCCCGGAC"));
console.log("TGTAGGGCCATGTTTATGAG")
console.log(getUndesirableFeature("plus", "TGTAGGGCCATGTTTATGAG"));
console.log("CTGCAGGCGGAGCTAAAGAT")
console.log(getUndesirableFeature("plus", "CTGCAGGCGGAGCTAAAGAT"));
console.log("GTCTGTGTTGACGCCGTCAA")
console.log(getUndesirableFeature("plus", "GTCTGTGTTGACGCCGTCAA"));
console.log("AAGTGTAGCCACAAGTCTGC")
console.log(getUndesirableFeature("plus", "AAGTGTAGCCACAAGTCTGC"));
console.log("CGTTCACAGAATCCTTCTTC")
console.log(getUndesirableFeature("plus", "CGTTCACAGAATCCTTCTTC"));
console.log("TATCCCTGCTACAACAGACA")
console.log(getUndesirableFeature("plus", "TATCCCTGCTACAACAGACA"));
console.log("ATTGCATTCCTCGCAGTGAC")
console.log(getUndesirableFeature("plus", "ATTGCATTCCTCGCAGTGAC"));
console.log("TGTGGCGACGCGCTAAGGCC")
console.log(getUndesirableFeature("plus", "TGTGGCGACGCGCTAAGGCC"));
console.log("GGTAGAGGCCCAATTCGGAG")
console.log(getUndesirableFeature("plus", "GGTAGAGGCCCAATTCGGAG"));
console.log("GATGTAGTTTAATCCGACTA")
console.log(getUndesirableFeature("plus", "GATGTAGTTTAATCCGACTA"));
console.log("CAGGACTGACCGAGTTGGAG")
console.log(getUndesirableFeature("plus", "CAGGACTGACCGAGTTGGAG"));
console.log("TGCCCGCTGTCCGTTAGCAA")
console.log(getUndesirableFeature("plus", "TGCCCGCTGTCCGTTAGCAA"));
console.log("CGGGAATTTATTTGCCAGGA")
console.log(getUndesirableFeature("plus", "CGGGAATTTATTTGCCAGGA"));
console.log("GTTGCCCGGCGGGCTGTCAC")
console.log(getUndesirableFeature("plus", "GTTGCCCGGCGGGCTGTCAC"));
console.log("CATGTTCATCCTACTACCCA")
console.log(getUndesirableFeature("plus", "CATGTTCATCCTACTACCCA"));
console.log("GTTCCACTCGAAGCCACCTA")
console.log(getUndesirableFeature("plus", "GTTCCACTCGAAGCCACCTA"));
console.log("CGTTGAGCTCGTTGGCCACA")
console.log(getUndesirableFeature("plus", "CGTTGAGCTCGTTGGCCACA"));
console.log("GTTGGGGAAACGTAAGCGTG")
console.log(getUndesirableFeature("plus", "GTTGGGGAAACGTAAGCGTG"));
console.log("TTGGTGGAAACCTTCATATA")
console.log(getUndesirableFeature("plus", "TTGGTGGAAACCTTCATATA"));
console.log("AGCCCGCGCTGCAGCACTTG")
console.log(getUndesirableFeature("plus", "AGCCCGCGCTGCAGCACTTG"));

console.log("\n\n\n\n\n\n\n\n\n\n")

console.log("ACCCCACAGTGGGGCCACTA")
console.log(getDesirableFeature("plus", "ACCCCACAGTGGGGCCACTA"));
console.log("TAGTCCAGGACCTTTGCCTC")
console.log(getDesirableFeature("plus", "TAGTCCAGGACCTTTGCCTC"));
console.log("TGGATGAAGCCCCGCGCGCG")
console.log(getDesirableFeature("plus", "TGGATGAAGCCCCGCGCGCG"));
console.log("GTCCGACCCTGGATGCCAAT")
console.log(getDesirableFeature("plus", "GTCCGACCCTGGATGCCAAT"));
console.log("TGAAGAGCATTCATCGTGAG")
console.log(getDesirableFeature("plus", "TGAAGAGCATTCATCGTGAG"));
console.log("TCTAGCACAACTATGTTGTC")
console.log(getDesirableFeature("plus", "TCTAGCACAACTATGTTGTC"));
console.log("GACAAGCAAGCCGTGCTTTC")
console.log(getDesirableFeature("plus", "GACAAGCAAGCCGTGCTTTC"));
console.log("TGTAGGGCGCCCACATCAGA")
console.log(getDesirableFeature("plus", "TGTAGGGCGCCCACATCAGA"));
console.log("CTTATCCTTACTGAACTGTG")
console.log(getDesirableFeature("plus", "CTTATCCTTACTGAACTGTG"));
console.log("GGTCAAGAACTACAATCCCT")
console.log(getDesirableFeature("plus", "GGTCAAGAACTACAATCCCT"));
console.log("ATACCTTGTGCTCATTGTAG")
console.log(getDesirableFeature("plus", "ATACCTTGTGCTCATTGTAG"));
console.log("TACCGGGCAGTCAGCGGTCC")
console.log(getDesirableFeature("plus", "TACCGGGCAGTCAGCGGTCC"));
console.log("ATCAACAATACCTCGATAGA")
console.log(getDesirableFeature("plus", "ATCAACAATACCTCGATAGA"));
console.log("TTCACGGAAACCCGTTGACT")
console.log(getDesirableFeature("plus", "TTCACGGAAACCCGTTGACT"));
console.log("GAAACGATGTTGCAGACTTT")
console.log(getDesirableFeature("plus", "GAAACGATGTTGCAGACTTT"));
console.log("TGCCGCCCCACGTGCGCATC")
console.log(getDesirableFeature("plus", "TGCCGCCCCACGTGCGCATC"));
console.log("CACTTTCATGGAGGCGGTGA")
console.log(getDesirableFeature("plus", "CACTTTCATGGAGGCGGTGA"));
console.log("CCGAGTGCCGCCATCCCAAT")
console.log(getDesirableFeature("plus", "CCGAGTGCCGCCATCCCAAT"));
console.log("GCTCTCCCAGCCGTCCGACC")
console.log(getDesirableFeature("plus", "GCTCTCCCAGCCGTCCGACC"));
console.log("GTGCTGAGCGGAGCCCGGAC")
console.log(getDesirableFeature("plus", "GTGCTGAGCGGAGCCCGGAC"));
console.log("TGTAGGGCCATGTTTATGAG")
console.log(getDesirableFeature("plus", "TGTAGGGCCATGTTTATGAG"));
console.log("CTGCAGGCGGAGCTAAAGAT")
console.log(getDesirableFeature("plus", "CTGCAGGCGGAGCTAAAGAT"));
console.log("GTCTGTGTTGACGCCGTCAA")
console.log(getDesirableFeature("plus", "GTCTGTGTTGACGCCGTCAA"));
console.log("AAGTGTAGCCACAAGTCTGC")
console.log(getDesirableFeature("plus", "AAGTGTAGCCACAAGTCTGC"));
console.log("CGTTCACAGAATCCTTCTTC")
console.log(getDesirableFeature("plus", "CGTTCACAGAATCCTTCTTC"));
console.log("TATCCCTGCTACAACAGACA")
console.log(getDesirableFeature("plus", "TATCCCTGCTACAACAGACA"));
console.log("ATTGCATTCCTCGCAGTGAC")
console.log(getDesirableFeature("plus", "ATTGCATTCCTCGCAGTGAC"));
console.log("TGTGGCGACGCGCTAAGGCC")
console.log(getDesirableFeature("plus", "TGTGGCGACGCGCTAAGGCC"));
console.log("GGTAGAGGCCCAATTCGGAG")
console.log(getDesirableFeature("plus", "GGTAGAGGCCCAATTCGGAG"));
console.log("GATGTAGTTTAATCCGACTA")
console.log(getDesirableFeature("plus", "GATGTAGTTTAATCCGACTA"));
console.log("CAGGACTGACCGAGTTGGAG")
console.log(getDesirableFeature("plus", "CAGGACTGACCGAGTTGGAG"));
console.log("TGCCCGCTGTCCGTTAGCAA")
console.log(getDesirableFeature("plus", "TGCCCGCTGTCCGTTAGCAA"));
console.log("CGGGAATTTATTTGCCAGGA")
console.log(getDesirableFeature("plus", "CGGGAATTTATTTGCCAGGA"));
console.log("GTTGCCCGGCGGGCTGTCAC")
console.log(getDesirableFeature("plus", "GTTGCCCGGCGGGCTGTCAC"));
console.log("CATGTTCATCCTACTACCCA")
console.log(getDesirableFeature("plus", "CATGTTCATCCTACTACCCA"));
console.log("GTTCCACTCGAAGCCACCTA")
console.log(getDesirableFeature("plus", "GTTCCACTCGAAGCCACCTA"));
console.log("CGTTGAGCTCGTTGGCCACA")
console.log(getDesirableFeature("plus", "CGTTGAGCTCGTTGGCCACA"));
console.log("GTTGGGGAAACGTAAGCGTG")
console.log(getDesirableFeature("plus", "GTTGGGGAAACGTAAGCGTG"));
console.log("TTGGTGGAAACCTTCATATA")
console.log(getDesirableFeature("plus", "TTGGTGGAAACCTTCATATA"));
console.log("AGCCCGCGCTGCAGCACTTG")
console.log(getDesirableFeature("plus", "AGCCCGCGCTGCAGCACTTG"));
*/
