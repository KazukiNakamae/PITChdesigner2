//=====================================================
// <img>要素 → Base64形式の文字列に変換
//   img       : HTMLImageElement
//   mime_type : string "image/png", "image/jpeg" など
//=====================================================
function ImageToBase64(img, mime_type) {
    // New Canvas
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw Image
    var ctx = canvas.getContext('2d');
    // To Base64
    return canvas.toDataURL(mime_type);
}
/**
 * @namespace writeProtocolPDF
 * @constructor
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @classdesc プロトコールのPDFを作成するクラス
 */
var writeProtocol = writeProtocol || {};
writeProtocol = function() {
    //配列デザインオブジェクト
    this.designobj = {};
};

/**
 * 書き出すプロトコール作成のためのデザインを読み込む
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {object} PITChdesigner デザイン済みの情報　（PITChdesigner class）
 * @return {boolean} 成功したかどうか
 */
writeProtocol.prototype.enterDesign = function(PITChdesigner) {
    var isSuccess = false;
    try {
        this.designobj = PITChdesigner;
        isSuccess = true;
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
};


/**
 * 指定された番号のプロトコールを書き出す
 * @author Kazuki Nakamae
 * @version 1.0
 * @since 1.0
 * @param {number} Draftnum デザイン候補番号
 * @return {boolean} 成功したかどうか
 */
writeProtocol.prototype.write = function(Draftnum) {
    var isSuccess = false;
    try {
        var img = new Image();
        img.src = "images/species/DNA.png";
        //プライマーリスト取得
        var pickedPrimer = {
            outerleft: this.designobj.pickGPrimer("outerleft", 3),
            outerright: this.designobj.pickGPrimer("outerright", 3),
            innerleft: this.designobj.pickGPrimer("innerleft", 3),
            innerright: this.designobj.pickGPrimer("innerright", 3)
        };

        console.log(img);
        var docDefinition = {
            // a string or { width: number, height: number }
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish
            pageOrientation: 'landscape',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
            pageMargins: [40, 60, 40, 60],

            footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            header: function(currentPage, pageCount) {
                // you can apply any logic and return any valid pdfmake element

                return { text: 'PITCh protocol', alignment: (currentPage % 2) ? 'left' : 'right' };
            },
            //background: function(currentPage) {
            //    return 'PITCh protocol ' + currentPage;
            //},
            content: [
                /*
                { text: 'Title', style: 'header' },
                { text: 'pagenumber', style: 'pagenumber' },
                {
                    text: [
                        'This paragraph is defined as an array of elements to make it possible to ',
                        { text: 'restyle part of it and make it bigger ', fontSize: 15 },
                        'than the rest.'
                    ]
                },
                {
                    columns: [{
                            // auto-sized columns have their widths based on their content
                            width: 'auto',
                            text: 'First column'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '*',
                            text: 'Second column'
                        },
                        {
                            // fixed width
                            width: 100,
                            text: 'Third column'
                        },
                        {
                            // percentage width
                            width: '10%',
                            text: 'Last column'
                        }
                    ],
                    // optional space between columns
                    columnGap: 10
                },
                {
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: ['*', 'auto', 100, '*'],

                        body: [
                            ['First', 'Second', 'Third', 'The last one'],
                            ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                            [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
                        ]
                    }
                },
                {
                    // to treat a paragraph as a bulleted list, set an array of items under the ul key
                    ul: [
                        'Item 1',
                        'Item 2',
                        'Item 3',
                        { text: 'Item 4', bold: true },
                    ]
                },

                'Numbered list example:',
                {
                    // for numbered lists set the ol key
                    ol: [
                        'Item 1',
                        'Item 2',
                        'Item 3'
                    ]
                },
                // margin: [left, top, right, bottom]
                { text: 'sample', margin: [5, 2, 10, 20] },

                // margin: [horizontal, vertical]
                { text: 'another text', margin: [5, 2] },

                // margin: equalLeftTopRightBottom
                { text: 'last one', margin: 5 },
                'paragraph 1',
                'paragraph 2',
                {
                    columns: [
                        'first column is a simple text',
                        {
                            stack: [
                                // second column consists of paragraphs
                                'paragraph A',
                                'paragraph B',
                                'these paragraphs will be rendered one below another inside the column'
                            ],
                            fontSize: 15
                        }
                    ]
                },
                {
                    // you can also fit the image inside a rectangle
                    image: 'mySuperImage',
                    fit: [100, 100],
                    pageBreak: 'after'
                },
                { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
                {
                    // you can also fit the image inside a rectangle
                    image: 'mySuperImage',
                    fit: [100, 100],
                    pageBreak: 'after'
                },
                */
                //////////////////////////////////////////////////////////////////////////////////////////////
                //Construction of the CRIS-PITCh (v2) donor vector
                { text: 'Construction of the CRIS-PITCh (v2) donor vector', style: 'header' },
                { text: '\n\n\n' },
                { text: '1 . Purchase or synthesis the following oligo' },
                { text: '\n' },
                {
                    ul: [
                        '3\' forward primer : ' + this.designobj.retrieveDesign("3fwdprimer", Draftnum).join(""),
                        '5\' reverse primer : ' + this.designobj.retrieveDesign("5revprimer", Draftnum).join(""),
                        '5\' forward primer : ' + this.designobj.retrieveDesign("5fwdprimer", Draftnum).join(""),
                        '3\' reverse primer : ' + this.designobj.retrieveDesign("3revprimer", Draftnum).join(""),
                        'Seq_onLacope_F : GCCCTTAATTGTGAGCGGATAAC',
                        'Seq_SV40pro_R : GGGGACTTTCCACACCCTAAC',
                    ]
                },
                { text: '\n\n\n' },
                { text: '2 . Prepare a PCR reaction mixture according to the following table.' },
                { text: '\n' },
                { text: 'PITCh donor backbone' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['PrimeSTAR Max Premix(2×)', 'TaKaRa, #R045A', '5'],
                            ['1 ng/µl pCRIS-PITChv2-FBL', 'Addgene, #63672', '0.5'],
                            ['10 µM 3\' forward primer', '-', '0.5'],
                            ['10 µM 5\' reverse primer', '-', '0.5'],
                            ['SDW', '-', '3.5']
                        ]
                    }
                },
                { text: '\n\n\n' },
                { text: 'PITCh donor insert' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['PrimeSTAR Max Premix(2×)', 'TaKaRa, #R045A', '5'],
                            ['1 ng/µl Template including GOI', '-', '0.5'],
                            ['10 µM 5\' forward primer', '-', '0.5'],
                            ['10 µM 3\' reverse primer', '-', '0.5'],
                            ['SDW', '-', '3.5']
                        ]
                    }
                },
                { text: '\n\n\n' },
                { text: '3 . Place the reactions in a thermal cycler and run an appropriate PCR program for 35 cycles (94°C-2 min, 35 cycles of (98°C-10 sec, 72°C-90 sec), 72°C-240 sec).' },
                { text: 'Note) If length of GOI sequence is >5kb, you should inscrease the extension time.' },
                { text: '\n\n\n' },
                { text: '4 . Run each PCR product on a agarose gel, and then stain the gel using ethidium bromide solution.' },
                { text: '\n\n\n' },
                { text: '5 . Excise the intended bands and collect them in Microtubes.' },
                { text: '\n\n\n' },
                { text: '6 . Purify the DNA using a Wizard SV gel and PCR clean-up system (Promega, cat. no. A9281).' },
                { text: '\n\n\n' },
                { text: '7 . Ligate the two purified DNA fragments using the In-Fusion HD cloning kit (Clontech, cat. no. 639648).' },
                { text: '\n\n\n' },
                { text: '8 . Transformation. Transform the products into XL1-Blue chemically competent cells as follows: mix 2 μl of the products and 20 μl of XL1-Blue cells, and incubate the mixture on ice for 10 min. Perform heat-shocking at 42 °C for 30 s. Incubate the cells on ice again for 5 min. Plate the transformed bacteria onto an LB plate containing 100 μg/ml ampicillin Culture the bacteria overnight at 37 °C.' },
                { text: '\n\n\n' },
                { text: '9 . Pick 2–4 colonies, and culture them with shaking overnight at 37 °C, in 3 ml of LB medium containing 100 μg/ml ampicillin.' },
                { text: '\n\n\n' },
                { text: '10. Purify the plasmid using a GenElute HP plasmid miniprep kit (Sigma, cat. no. NA0160).' },
                { text: '\n\n\n' },
                { text: '11. Confirm the addition of the microhomologies by DNA sequencing using Seq_onLacope_F and Seq_SV40pro_R primers.' },
                { text: '\n\n\n' },
                { text: 'Construction of the CRISPR-Cas9 vector for CRIS-PITCh (v2)', style: 'header' },
                { text: '\n\n\n' },
                { text: '1 . Purchase or synthesis the following oligo' },
                { text: '\n' },
                {
                    ul: [
                        'sence oligonucleotide : ' + this.designobj.retrieveDesign("pU6gRNAsense", Draftnum).join(""),
                        'antisence oligonucleotide : ' + this.designobj.retrieveDesign("pU6gRNAantisense", Draftnum).join(""),
                        'CRISPR-step2-F : GCCTTTTGCTGGCCTTTTGCTC',
                        'CRISPR-step2-R : CGGGCCATTTACCGTAAGTTATGTAACG'
                    ]
                },
                { text: '\n\n\n' },
                { text: '2 . Anneal the synthesized oligonucleotides designed to target the desired genomic locus, and insert them into the pX330A-1x2 vector, according to the previously published protocol.:\n' },
                { text: '[Ran, F.A. et al. Genome engineering using the CRISPR-Cas9 system. Nat. Protoc. 8, 2281–2308 (2013). : http://dx.doi.org/10.1038/nprot.2013.143]', link: 'http://dx.doi.org/10.1038/nprot.2013.143' },
                { text: '\n\n\n' },
                { text: '3 . Mix the following components in a PCR tube:' },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['50 ng/μl pX330A-1×2_gene_X (with oligonucleotides inserted)', '-', '1.5'],
                            ['100 ng/μl pX330S-2-PITCh', 'Addgene, #63670', '1.5'],
                            ['10× T4 DNA ligase reaction buffer', 'New England Biolabs, cat. no. B0202S', '2'],
                            ['BsaI-HF', 'Life Technologies, cat. no. R0535', '1'],
                            ['Quick ligase', 'Quick ligation kit (New England Biolabs, cat. no. M2200)', '1'],
                            ['ddH2O', '-', '13']
                        ]
                    }
                },
                { text: '\n\n\n' },
                { text: '4 . Perform Golden Gate assembly in a thermal cycler under the following conditions: (37 °C, 5 min → 16 °C, 10 min) × 25 → 4 °C, ∞.' },
                { text: '\n\n\n' },
                { text: '5 . Take the tube from the thermal cycler and add the following reagents:' },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['10× NEBuffer 4', 'New England Biolabs, cat. no. B7004S', '2.5'],
                            ['10×BSA', 'takara', '2.5'],
                            ['BsaI-HF', 'Life Technologies, cat. no. R0535', '1']
                        ]
                    }
                },
                { text: '\n\n\n' },
                { text: '6 . Place the tube in the thermal cycler again, and run the following program: 37 °C, 30 min → 80 °C, 5 min → 4 °C, ∞.' },
                { text: '\n\n\n' },
                { text: '7 . Transformation. Transform the products into XL1-Blue chemically competent cells as follows: mix 2 μl of the products and 20 μl of XL1-Blue cells, and incubate the mixture on ice for 10 min. Perform heat-shocking at 42 °C for 30 s. Incubate the cells on ice again for 5 min. Plate the transformed bacteria onto an LB plate containing 100 μg/ml ampicillin with X-Gal/IPTG. Culture the bacteria overnight at 37 °C.' },
                { text: '\n\n\n' },
                { text: '8 . The next day, perform colony PCR on 2–4 white colonies using the CRISPR-step2-F and CRISPR-step2-R primers, as described in following steps.' },
                { text: '\n\n\n' },
                { text: '9 . Mix the following components in PCR tubes:' },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['2×PCR Buffer for KOD FX Neo', 'TOYOBO, cat. no. KFX-201', '5'],
                            ['10 μM primer mixture (F+R)', '-', '0.5'],
                            ['2 mM dNTP mixture', 'TOYOBO, cat. no. KFX-201', '2'],
                            ['1 U/μl KOD Fx neo', 'TOYOBO, cat. no. KFX-201', '0.2'],
                            ['ddH2O', '-', '2.3']
                        ]
                    }
                },
                { text: '[Notice : An alternative to this item is BIOLINE HybriPol DNA Polymerase or equivalent.] ' },
                { text: '\n\n\n' },
                { text: '10 . For each reaction mix, pick a white colony, add it to a reaction mixture and stab it into another LB plate (replica plate). Place the replica plate at 37 °C and grow it overnight. The replica plate can be stored at 4 °C.' },
                { text: '\n\n\n' },
                { text: '11 . Place the reactions in a thermal cycler, and run an appropriate PCR program: (94°C-2 min, 27 cycles of (94°C-30 sec, 55°C-30 sec, 68°C-30 sec), 68°C-120 sec).' },
                { text: '\n\n\n' },
                { text: '12 . Run the PCR products on a 2% (wt/vol) agarose gel. Stain the gel with ethidium bromide and confirm the presence of the intended amplicon.' },
                { text: '\n\n\n' },
                { text: '13 . Select positive clones from the replica plate and culture them with shaking overnight at 37 °C, in 3 ml of LB medium containing 100 μg/ml ampicillin.' },
                { text: '\n\n\n' },
                { text: '14 . Purify the plasmid using a GenElute HP plasmid miniprep kit (Sigma, cat. no. NA0160).' },
                { text: '\n\n\n' },
                { text: 'Genotyping by Sequencing.', style: 'header' },
                { text: '\n\n\n' },
                { text: '1 . Purchase or synthesis the following oligo' },
                { text: '\n' },
                {
                    ul: [
                        'outer left primer : ' + pickedPrimer.outerleft[0].primer,
                        'outer right primer : ' + pickedPrimer.outerright[0].primer,
                        'inner left primer : ' + pickedPrimer.innerleft[0].primer,
                        'inner right primer : ' + pickedPrimer.innerright[0].primer,
                    ]
                },
                { text: '\n\n\n' },
                { text: '2 . perform genomic PCR with KOD FX Neo. Primers should be designed to separately amplify the 5′ and 3′ junctions of the knock-in cassette using outer left primer & inner left primer or outer right primer & inner right primer. Mix the following components in a PCR tube:' },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],

                        body: [
                            ['Component', 'Cat No.', 'Volume [µl]'],
                            ['2×PCR Buffer for KOD FX Neo', 'TOYOBO, cat. no. KFX-201', '5'],
                            ['10 μM primer mixture (F+R)', '-', '1.2'],
                            ['2 mM dNTP mixture', 'TOYOBO, cat. no. KFX-201', '2'],
                            ['1 U/μl KOD Fx neo', 'TOYOBO, cat. no. KFX-201', '0.2'],
                            ['100 ng/μl genomic DNA', '-', '2'],
                            ['ddH2O', '-', '0.5']
                        ]
                    }
                },
                { text: '\n\n\n' },
                { text: '3 . Place the reactions in a thermal cycler and run the following program: (94°C-2 min, 35 cycles of (94°C-30 sec, 68°C-30 sec), 68°C-300 sec).' },
                { text: '\n\n\n' },
                { text: '4 . Run an aliquot of the PCR products on a 2% (wt/vol) agarose gel. Stain the gel with ethidium bromide and confirm the presence of the intended amplicon.' },
                { text: '\n\n\n' },
                { text: '5 . Clone the remaining PCR product into the pTA2 vector using TArget Clone Plus according to the manufacturer\'s instructions. The PCR product can directly be used for TA cloning without gel purification using this kit.' },
                { text: '\n\n\n' },
                { text: '6 . Transformation. Transform the products into XL1-Blue chemically competent cells as follows: mix 2 μl of the products and 20 μl of XL1-Blue cells, and incubate the mixture on ice for 10 min. Perform heat-shocking at 42 °C for 30 s. Incubate the cells on ice again for 5 min. Plate the transformed bacteria onto an LB plate containing 100 μg/ml ampicillin with X-Gal/IPTG. Culture the bacteria overnight at 37 °C.' },
                { text: '\n\n\n' },
                { text: '7 . Perform colony PCR using gene-specific primers or M13 fwd & rev primers.' },
                { text: '\n\n\n' },
                { text: '8 . Run the PCR products on a 2% (wt/vol) agarose gel and confirm the presence of the insert.' },
                { text: '\n\n\n' },
                { text: '9 . Culture the intended clones from the replica plate with shaking overnight at 37 °C in 3 ml of LB medium containing 100 μg/ml ampicillin.' },
                { text: '\n\n\n' },
                { text: '10 .Purify the plasmid using an appropriate miniprep kit.' },
                { text: '\n\n\n' },
                { text: '11 .Sequence the plasmids with T7 and T3 primers and confirm the knock-in sequence.' }
            ],
            styles: {
                header: {
                    fontSize: 22
                },
                pagenumber: {
                    italic: true,
                    alignment: 'right'
                }
            },
            images: {
                mySuperImage: ImageToBase64(img, "image/png")
            }
        };
        pdfMake.createPdf(docDefinition).open();
    } catch (e) {
        console.error(e);
    } finally {
        return isSuccess;
    }
};