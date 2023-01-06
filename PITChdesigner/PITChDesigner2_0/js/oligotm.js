/**
 * @license
 * Copyright (c) 2017
 * Kazuki Nakamae
 * All rights reserved.
 *
 * This file is part of the oligotm library.
 * The library is converted from C/C++ code to JavaScript code.
 * C/C++ version code (https://sourceforge.net/projects/primer3/) was written by following developers;
 * Whitehead Institute for Biomedical Research, Steve Rozen
 * (http://purl.com/STEVEROZEN/), Andreas Untergasser and Helen Skaletsky.
 *
 *   The oligotm library is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   The oligotm library is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with the oligtm library (file gpl-2.0.txt in the source
 *   distribution); if not, write to the Free Software
 *   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @version 1.0
 * update date 2017/6/7
 * 
 */
"use strict";

//function//////////////////////////////////////////////////////////////////////
//check 
if (typeof setInherits !== "undefined") {
    console.warn("[Warn] oligotmjs library defines newly setInherits() at global scope level.")
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
    console.info("[Info] setInherits() is defined at global scope level.")
}
//Polyfill//////////////////////////////////////////////////////////////////////
Math.log10 = Math.log10 || function(x) { return Math.log(x) / Math.LN10; };
//oligotm class///////////////////////////////////////////////////////////
/**
 * @namespace oligotm
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @classdesc calculate Tm value such as oligotm, which is part of the primer3.
 */
var oligotm = oligotm || {};
oligotm = function() {
    this._OLIGO_TM = 1;
    this.OLIGOTM_ERROR = -Infinity;
    this.tm_method_type = { breslauer_auto: 0, santalucia_auto: 1 };
    this.salt_correction_type = { schildkraut: 0, santalucia: 1, owczarzy: 2 };
    this.T_KELVIN = 273.15;

    /*
     * Two tables of nearest-neighbor parameters for di-nucleotide
     * base pairs.
     *
     * These are included in this file because they are not needed by
     * clients (callers) of oligtm().
     */
    this.NNparam = {
        /* Table 1 (old parameters):
         * See table 2 in the paper [Breslauer KJ, Frank R, Bl�cker H and
         * Marky LA (1986) "Predicting DNA duplex stability from the base
         * sequence" Proc Natl Acad Sci 83:4746-50
         * http://dx.doi.org/10.1073/pnas.83.11.3746]
         */
        "STATE1": {
            "S": {
                "A": { "A": 240, "C": 173, "G": 208, "T": 239, "N": 215 },
                "C": { "A": 129, "C": 266, "G": 278, "T": 208, "N": 220 },
                "G": { "A": 135, "C": 267, "G": 266, "T": 173, "N": 210 },
                "T": { "A": 169, "C": 135, "G": 129, "T": 240, "N": 168 },
                "N": { "A": 168, "C": 210, "G": 220, "T": 215, "N": 203 }
            },
            "H": {
                "A": { "A": 91, "C": 65, "G": 78, "T": 86, "N": 80 },
                "C": { "A": 58, "C": 110, "G": 119, "T": 78, "N": 91 },
                "G": { "A": 56, "C": 111, "G": 110, "T": 65, "N": 85 },
                "T": { "A": 60, "C": 56, "G": 58, "T": 91, "N": 66 },
                "N": { "A": 66, "C": 85, "G": 91, "T": 80, "N": 80 }
                /* Delta G's of disruption * 1000. */
            },
            "G": {
                "A": { "A": 1900, "C": 1300, "G": 1600, "T": 1500, "N": 1575 },
                "C": { "A": 1900, "C": 3100, "G": 3600, "T": 1600, "N": 2550 },
                "G": { "A": 1600, "C": 3100, "G": 3100, "T": 1300, "N": 2275 },
                "T": { "A": 900, "C": 1600, "G": 1900, "T": 1900, "N": 1575 },
                "N": { "A": 1575, "C": 2275, "G": 2550, "T": 1575, "N": 1994 }
            }
        },
        /* Table 2, new parameters:
         * Tables of nearest-neighbor thermodynamics for DNA bases, from the
         * paper [SantaLucia JR (1998) "A unified view of polymer, dumbbell
         * and oligonucleotide DNA nearest-neighbor thermodynamics", Proc Natl
         * Acad Sci 95:1460-65 http://dx.doi.org/10.1073/pnas.95.4.1460]
         */
        "STATE2": {
            "S": {
                "A": { "A": 222, "C": 224, "G": 210, "T": 204, "N": 224 },
                "C": { "A": 227, "C": 199, "G": 272, "T": 210, "N": 272 },
                "G": { "A": 222, "C": 244, "G": 199, "T": 224, "N": 244 },
                "T": { "A": 213, "C": 222, "G": 227, "T": 222, "N": 227 },
                "N": { "A": 168, "C": 210, "G": 220, "T": 215, "N": 220 }
            },
            "H": {
                "A": { "A": 79, "C": 84, "G": 78, "T": 72, "N": 72 },
                "C": { "A": 85, "C": 80, "G": 106, "T": 78, "N": 78 },
                "G": { "A": 82, "C": 98, "G": 80, "T": 84, "N": 80 },
                "T": { "A": 72, "C": 82, "G": 85, "T": 79, "N": 72 },
                "N": { "A": 72, "C": 80, "G": 78, "T": 72, "N": 72 }
                /* Delta G's of disruption * 1000. */
                ,
            },
            "G": {
                "A": { "A": 1000, "C": 1440, "G": 1280, "T": 880, "N": 880 },
                "C": { "A": 1450, "C": 1840, "G": 2170, "T": 1280, "N": 1450 },
                "G": { "A": 1300, "C": 2240, "G": 1840, "T": 1440, "N": 1300 },
                "T": { "A": 580, "C": 1300, "G": 1450, "T": 1000, "N": 580 },
                "N": { "A": 580, "C": 1300, "G": 1280, "T": 880, "N": 580 }
            }
        }
    }
}

/**
 * Calculate the melting temperature of oligos.
 * @author Kazuki Nakamae <kazukinakamae@gmail.com>
 * @version 1.0
 * @since 1.0
 * @param  {string} seq sequence
 * @param  {number} dna_conc DNA concentration (nanomolar)
 * @param  {number} salt_conc concentration of salt
 * @param  {number} divalent_conc Salt concentration (millimolar)
 * @param {number} dntp_conc Concentration of dNTPs (millimolar)
 * @param {number} tm_method member of this.tm_method_type
 * @param {number} salt_corrections member of this.salt_correction_type
 * @return {number} Tm value
 */
oligotm.prototype.oligotm = function(seq, dna_conc, salt_conc, divalent_conc, dntp_conc, tm_method, salt_corrections) {
    seq = seq.toUpperCase()
    var dh = 0,
        ds = 0;
    var c = "";
    var delta_H, delta_S;
    var Tm; //Melting temperature
    var correction;
    var len, sym;
    var d = seq

    //print debug start
    //this.OLIGOTM_ERROR = "Error";
    //print debug end
    //this.OLIGOTM_ERROR = -Infinity;

    if (this.divalent_to_monovalent(divalent_conc, dntp_conc) == this.OLIGOTM_ERROR) return this.OLIGOTM_ERROR;
    /** salt_conc = salt_conc + divalent_to_monovalent(divalent_conc, dntp_conc); **/
    if (tm_method != this.tm_method_type.breslauer_auto &&
        tm_method != this.tm_method_type.santalucia_auto) return this.OLIGOTM_ERROR;
    if (salt_corrections != this.salt_correction_type.schildkraut &&
        salt_corrections != this.salt_correction_type.santalucia &&
        salt_corrections != this.salt_correction_type.owczarzy) return this.OLIGOTM_ERROR;

    len = (seq.length - 1);

    sym = this.symmetry(seq); /*Add symmetry correction if seq is symmetrical*/
    if (tm_method == this.tm_method_type.breslauer_auto) {
        ds = 108;
    } else {
        if (sym == 1) {
            ds += 14;
        }

        /** Terminal AT penalty **/

        if (seq.substr(0, 1) === "A" ||
            seq.substr(0, 1) === "T") {
            ds += -41;
            dh += -23;
        } else if (seq.substr(0, 1) === "C" ||
            seq.substr(0, 1) === "G") {
            ds += 28;
            dh += -1;
        }
        if (seq.substr(-1) === "T" ||
            seq.substr(-1) === "A") {
            ds += -41;
            dh += -23;
        } else if (seq.substr(-1) === "C" ||
            seq.substr(-1) === "G") {
            ds += 28;
            dh += -1;
        }
    }
    /* Use a finite-state machine (DFA) to calucluate dh and ds for s. */
    try {
        var state = "";
        if (tm_method == this.tm_method_type.breslauer_auto) {
            state = "STATE1";
        } else {
            state = "STATE2";
        }
        for (var i = 0; i < seq.length - 1; i++) {
            ds = ds + this.NNparam[state]["S"][seq[i]][seq[i + 1]]
            dh = dh + this.NNparam[state]["H"][seq[i]][seq[i + 1]]
        }
    } catch (e) {
        return this.OLIGOTM_ERROR;
    }
    delta_H = dh * -100.0;
    /* 
     * Nearest-neighbor thermodynamic values for dh
     * are given in 100 cal/mol of interaction.
     */
    delta_S = ds * -0.1;
    /*
     * Nearest-neighbor thermodynamic values for ds
     * are in in .1 cal/K per mol of interaction.
     */
    Tm = 0; /* Melting temperature */
    len = len + 1;

    if (salt_corrections == this.salt_correction_type.schildkraut) {
        salt_conc = salt_conc + this.divalent_to_monovalent(divalent_conc, dntp_conc);
        correction = 16.6 * Math.log10(salt_conc / 1000.0) - this.T_KELVIN;
        Tm = delta_H / (delta_S + 1.987 * Math.log(dna_conc / 4000000000.0)) + correction;
    } else if (salt_corrections == this.salt_correction_type.santalucia) {
        salt_conc = salt_conc + this.divalent_to_monovalent(divalent_conc, dntp_conc);
        delta_S = delta_S + 0.368 * (len - 1) * Math.log(salt_conc / 1000.0);
        if (sym == 1) { /* primer is symmetrical */
            /* Equation A */
            Tm = delta_H / (delta_S + 1.987 * Math.log(dna_conc / 1000000000.0)) - this.T_KELVIN;
        } else {
            /* Equation B */
            Tm = delta_H / (delta_S + 1.987 * Math.log(dna_conc / 4000000000.0)) - this.T_KELVIN;
        }
    } else if (salt_corrections == this.salt_correction_type.owczarzy) {
        //counting CG%
        var gcPercent = 0;
        var free_divalent; /* conc of divalent cations minus dNTP conc */
        var i;
        gcPercent = seq.match(/[CG]/gm).length / seq.length;
        /**** BEGIN: UPDATED SALT BY OWCZARZY *****/
        /* different salt corrections for monovalent (Owczarzy et al.,2004) 
        and divalent cations (Owczarzy et al.,2008)
        */
        /* competition bw magnesium and monovalent cations, see Owczarzy et al., 2008 Figure 9 and Equation 16 */
        var crossover_point = 0.22;
        /* depending on the value of div_monov_ratio respect
					     to value of crossover_point Eq 16 (divalent corr, Owczarzy et al., 2008)
					     or Eq 22 (monovalent corr, Owczarzy et al., 2004) should be used */
        var div_monov_ratio;
        if (dntp_conc >= divalent_conc) {
            free_divalent = 0.00000000001; /* to not to get log(0) */
        } else {
            free_divalent = (divalent_conc - dntp_conc) / 1000.0;
        }
        var a = 0,
            b = 0,
            c = 0,
            d = 0,
            e = 0,
            f = 0,
            g = 0;
        if (salt_conc == 0) {
            div_monov_ratio = 6.0;
        } else {
            div_monov_ratio = (Math.sqrt(free_divalent)) / (salt_conc / 1000);
            /* if conc of monov cations is provided
            a ratio is calculated to further calculate
            the _correct_ correction */
        }
        if (div_monov_ratio < crossover_point) {
            /* use only monovalent salt correction, Eq 22 (Owczarzy et al., 2004) */
            correction
                = (((4.29 * gcPercent) - 3.95) * Math.pow(10, -5) * Math.log(salt_conc / 1000.0)) +
                (9.40 * Math.pow(10, -6) * (Math.pow(Math.log(salt_conc / 1000.0), 2)));
        } else {
            /* magnesium effects are dominant, Eq 16 (Owczarzy et al., 2008) is used */
            b = -9.11 * Math.pow(10, -6);
            c = 6.26 * Math.pow(10, -5);
            e = -4.82 * Math.pow(10, -4);
            f = 5.25 * Math.pow(10, -4);
            a = 3.92 * Math.pow(10, -5);
            d = 1.42 * Math.pow(10, -5);
            g = 8.31 * Math.pow(10, -5);
            if (div_monov_ratio < 6.0) {
                /* in particular ratio of conc of monov and div cations
                 *             some parameters of Eq 16 must be corrected (a,d,g) */
                a = 3.92 * Math.pow(10, -5) * (0.843 - (0.352 * Math.sqrt(salt_conc / 1000.0) * Math.log(salt_conc / 1000.0)));
                d = 1.42 * Math.pow(10, -5) * (1.279 - 4.03 * Math.pow(10, -3) * Math.log(salt_conc / 1000.0) - 8.03 * Math.pow(10, -3) * Math.pow(Math.log(salt_conc / 1000.0), 2));
                g = 8.31 * Math.pow(10, -5) * (0.486 - 0.258 * Math.log(salt_conc / 1000.0) + 5.25 * Math.pow(10, -3) * Math.pow(Math.log(salt_conc / 1000.0), 3));
            }

            correction = a + (b * Math.log(free_divalent)) +
                gcPercent * (c + (d * Math.log(free_divalent))) +
                (1 / (2 * (len - 1))) * (e + (f * Math.log(free_divalent)) +
                    g * (Math.pow((Math.log(free_divalent)), 2)));
        }
        /**** END: UPDATED SALT BY OWCZARZY *****/
        if (sym == 1) {
            /* primer is symmetrical */
            /* Equation A */
            Tm = 1 / ((1 / (delta_H /
                (delta_S + 1.9872 * Math.log(dna_conc / 1000000000.0)))) + correction) - this.T_KELVIN;
        } else {
            /* Equation B */
            Tm = 1 / ((1 / (delta_H /
                (delta_S + 1.9872 * Math.log(dna_conc / 4000000000.0)))) + correction) - this.T_KELVIN;
        }
    } /* END else if (salt_corrections == owczarzy) { */

    /***************************************/
    return this.floatFormat(Tm, 6);
}

/**
 * check that string is symmetrical.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {string} seq sequence
 * @return  {number} isSymmetrical is Symmetrical or not(true:1/false:0)
 */
oligotm.prototype.symmetry = function(seq) {
    seq = seq.toUpperCase();
    var isSymmetrical;
    var i = 0;
    var seq_len = seq.length;
    var mp = seq_len / 2;
    if (seq_len % 2 == 1) {
        isSymmetrical = 0;
        return isSymmetrical
    }
    while (i < mp) {
        if (seq.charAt(i) === 'A' && seq.charAt(seq_len - i - 1) !== 'T' ||
            seq.charAt(i) === 'T' && seq.charAt(seq_len - i - 1) !== 'A' ||
            seq.charAt(i) === 'A' && seq.charAt(seq_len - i - 1) !== 'T' ||
            seq.charAt(i) === 'T' && seq.charAt(seq_len - i - 1) !== 'A') {
            isSymmetrical = 0;
            return isSymmetrical
        }
        if (seq.charAt(i) === 'C' && seq.charAt(seq_len - i - 1) !== 'G' ||
            seq.charAt(i) === 'G' && seq.charAt(seq_len - i - 1) !== 'C' ||
            seq.charAt(i) === 'C' && seq.charAt(seq_len - i - 1) !== 'G' ||
            seq.charAt(i) === 'G' && seq.charAt(seq_len - i - 1) !== 'C') {
            isSymmetrical = 0;
            return isSymmetrical
        }
        i = i + 1;
    }
    isSymmetrical = 1;
    return isSymmetrical
}

/**
 * Convert divalent salt concentration to monovalent
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {number} divalent Salt concentration (millimolar)
 * @param  {number} dntp Concentration of dNTPs (millimolar)
 */
oligotm.prototype.divalent_to_monovalent = function(divalent, dntp) {
    if (divalent == 0) dntp = 0;
    if (divalent < 0 || dntp < 0) return this.OLIGOTM_ERROR;
    if (divalent < dntp) divalent = dntp;
    /* According to theory, melting temperature does not depend on divalent cations */
    return 120 * (Math.sqrt(divalent - dntp));
}

/**
 * round float number at a paticular place.
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param  {number} value rounded value
 * @param  {number} point place of round
 */
oligotm.prototype.floatFormat = function(value, point) {
    var _pow = Math.pow(10, point);

    return Math.round(value * _pow) / _pow;
}