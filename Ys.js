(function(window, undefined) {
    
    "use strict";
    
    //var Ys = {};

    /*快速选择器*/
    var Ys = function(selector,context) {
        //return document.getElementById(id);
        return new Ys.prototype.init(selector,context);
    };

    /*类jquery实现
    var F = function(selector,context) {
        //console.log(Ys.find);
        return this.init(selector,context);
        //return this.getElementById(selector);
    };
*/
    Ys.prototype.init =function (selector,context) {
        var results;
        if(typeof(selector) === "object") {
            this.element = selector;
        } else {
            results = Ys.find(selector);
            this.length = results.length;
            if (results.length === 0) return null;
            if(results.length === 1)this.element = results[0];
            for (var i = 0; i < this.length; i++) {
                this[i] = results[i];
            }
        }
        return this;
    };

    Ys.prototype.getElementById = function(id) {
        if(typeof(id) === "object") {
            this.element = id;
        } else {
            this.element = document.getElementById(id);
        }
        return this;
    };

    Ys.prototype.bind =function(type,fn) {
        Ys.addEventListener(this.element,type,fn);
        return this;
    };

    Ys.prototype.hide = function() {
        this.element.style.display = "none";
        return this;
    };

    Ys.prototype.show = function() {
        this.element.style.display = "block";
        return this;
    };

    Ys.prototype.addClass = function(className) {
        Ys.addClass(this.element,className);
        return this;
    };

    Ys.prototype.removeClass = function(className) {
        Ys.removeClass(this.element,className);
        return this;
    };

    /*F.prototype.element = function() {
        return this.element;
    };*/

    Ys.prototype.attr = function(attribute) {
        return this.element.getAttribute(attribute);
    };

    Ys.prototype.append = function(html) {
        this.element.innerHTML += html;
        return this;
    };

    Ys.prototype.on = function() {

    };

    Ys.prototype.each = function(fn) {

    };

    Ys.prototype.init.prototype = Ys.prototype;

    var defer = function () {
        var queue = [], value, i, callback;
        return {
            resolve: function ( _value ) {
                value = _value;
                for ( i = -1; callback = queue[++i]; ) {
                    callback( value );
                }
                queue = undefined;
            },
            then: function ( _callback ) {
                if ( queue ) {
                    queue.push( _callback );
                } else {
                    callback( value );
                }
            }
        };
    };
        
    /*var $class = function(className) {
        return document.getElementsByClassName(className);
    };*/
    
    //Ys = $;

    window.Ys = Ys;

})(window);

/*!
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function( window ) {

var i,
    support,
    cachedruns,
    Expr,
    getText,
    isXML,
    compile,
    outermostContext,
    sortInput,
    hasDuplicate,

    // Local document vars
    setDocument,
    document,
    docElem,
    documentIsHTML,
    rbuggyQSA,
    rbuggyMatches,
    matches,
    contains,

    // Instance-specific data
    expando = "sizzle" + -(new Date()),
    preferredDoc = window.document,
    dirruns = 0,
    done = 0,
    classCache = createCache(),
    tokenCache = createCache(),
    compilerCache = createCache(),
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
        }
        return 0;
    },

    // General-purpose constants
    strundefined = typeof undefined,
    MAX_NEGATIVE = 1 << 31,

    // Instance methods
    hasOwn = ({}).hasOwnProperty,
    arr = [],
    pop = arr.pop,
    push_native = arr.push,
    push = arr.push,
    slice = arr.slice,
    // Use a stripped-down indexOf if we can't use a native one
    indexOf = arr.indexOf || function( elem ) {
        var i = 0,
            len = this.length;
        for ( ; i < len; i++ ) {
            if ( this[i] === elem ) {
                return i;
            }
        }
        return -1;
    },

    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

    // Regular expressions

    // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace = "[\\x20\\t\\r\\n\\f]",
    // http://www.w3.org/TR/css3-syntax/#characters
    characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    // Loosely modeled on CSS identifier characters
    // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
    // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier = characterEncoding.replace( "w", "w#" ),

    // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
        "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

    // Prefer arguments quoted,
    //   then not containing pseudos/brackets,
    //   then attribute selectors/non-parenthetical expressions,
    //   then anything else
    // These preferences are here to reduce the number of selectors
    //   needing tokenize in the PSEUDO preFilter
    pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

    rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

    rpseudo = new RegExp( pseudos ),
    ridentifier = new RegExp( "^" + identifier + "$" ),

    matchExpr = {
        "ID": new RegExp( "^#(" + characterEncoding + ")" ),
        "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
        "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
            "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
        // For use in libraries implementing .is()
        // We use this for POS matching in `select`
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    },

    rinputs = /^(?:input|select|textarea|button)$/i,
    rheader = /^h\d$/i,

    rnative = /^[^{]+\{\s*\[native \w/,

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    rsibling = /[+~]/,
    rescape = /'|\\/g,

    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
    funescape = function( _, escaped, escapedWhitespace ) {
        var high = "0x" + escaped - 0x10000;
        // NaN means non-codepoint
        // Support: Firefox
        // Workaround erroneous numeric interpretation of +"0x"
        return high !== high || escapedWhitespace ?
            escaped :
            high < 0 ?
                // BMP codepoint
                String.fromCharCode( high + 0x10000 ) :
                // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    };

// Optimize for push.apply( _, NodeList )
try {
    push.apply(
        (arr = slice.call( preferredDoc.childNodes )),
        preferredDoc.childNodes
    );
    // Support: Android<4.0
    // Detect silently failing push.apply
    arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
    push = { apply: arr.length ?

        // Leverage slice if possible
        function( target, els ) {
            push_native.apply( target, slice.call(els) );
        } :

        // Support: IE<9
        // Otherwise append directly
        function( target, els ) {
            var j = target.length,
                i = 0;
            // Can't trust NodeList.length
            while ( (target[j++] = els[i++]) ) {}
            target.length = j - 1;
        }
    };
}

function Sizzle( selector, context, results, seed ) {
    var match, elem, m, nodeType,
        // QSA vars
        i, groups, old, nid, newContext, newSelector;

    if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
        setDocument( context );
    }

    context = context || document;
    results = results || [];

    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
        return [];
    }

    if ( documentIsHTML && !seed ) {

        // Shortcuts
        if ( (match = rquickExpr.exec( selector )) ) {
            // Speed-up: Sizzle("#ID")
            if ( (m = match[1]) ) {
                if ( nodeType === 9 ) {
                    elem = context.getElementById( m );
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document (jQuery #6963)
                    if ( elem && elem.parentNode ) {
                        // Handle the case where IE, Opera, and Webkit return items
                        // by name instead of ID
                        if ( elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    } else {
                        return results;
                    }
                } else {
                    // Context is not a document
                    if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                        contains( context, elem ) && elem.id === m ) {
                        results.push( elem );
                        return results;
                    }
                }

            // Speed-up: Sizzle("TAG")
            } else if ( match[2] ) {
                push.apply( results, context.getElementsByTagName( selector ) );
                return results;

            // Speed-up: Sizzle(".CLASS")
            } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
                push.apply( results, context.getElementsByClassName( m ) );
                return results;
            }
        }

        // QSA path
        if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
            nid = old = expando;
            newContext = context;
            newSelector = nodeType === 9 && selector;

            // qSA works strangely on Element-rooted queries
            // We can work around this by specifying an extra ID on the root
            // and working up from there (Thanks to Andrew Dupont for the technique)
            // IE 8 doesn't work on object elements
            if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                groups = tokenize( selector );

                if ( (old = context.getAttribute("id")) ) {
                    nid = old.replace( rescape, "\\$&" );
                } else {
                    context.setAttribute( "id", nid );
                }
                nid = "[id='" + nid + "'] ";

                i = groups.length;
                while ( i-- ) {
                    groups[i] = nid + toSelector( groups[i] );
                }
                newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
                newSelector = groups.join(",");
            }

            if ( newSelector ) {
                try {
                    push.apply( results,
                        newContext.querySelectorAll( newSelector )
                    );
                    return results;
                } catch(qsaError) {
                } finally {
                    if ( !old ) {
                        context.removeAttribute("id");
                    }
                }
            }
        }
    }

    // All others
    return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
    var keys = [];

    function cache( key, value ) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if ( keys.push( key + " " ) > Expr.cacheLength ) {
            // Only keep the most recent entries
            delete cache[ keys.shift() ];
        }
        return (cache[ key + " " ] = value);
    }
    return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
    fn[ expando ] = true;
    return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
    var div = document.createElement("div");

    try {
        return !!fn( div );
    } catch (e) {
        return false;
    } finally {
        // Remove from its parent by default
        if ( div.parentNode ) {
            div.parentNode.removeChild( div );
        }
        // release memory in IE
        div = null;
    }
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
    var arr = attrs.split("|"),
        i = attrs.length;

    while ( i-- ) {
        Expr.attrHandle[ arr[i] ] = handler;
    }
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
    var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
            ( ~b.sourceIndex || MAX_NEGATIVE ) -
            ( ~a.sourceIndex || MAX_NEGATIVE );

    // Use IE sourceIndex if available on both nodes
    if ( diff ) {
        return diff;
    }

    // Check if b follows a
    if ( cur ) {
        while ( (cur = cur.nextSibling) ) {
            if ( cur === b ) {
                return -1;
            }
        }
    }

    return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
    return markFunction(function( argument ) {
        argument = +argument;
        return markFunction(function( seed, matches ) {
            var j,
                matchIndexes = fn( [], seed.length, argument ),
                i = matchIndexes.length;

            // Match elements found at the specified indexes
            while ( i-- ) {
                if ( seed[ (j = matchIndexes[i]) ] ) {
                    seed[j] = !(matches[j] = seed[j]);
                }
            }
        });
    });
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
    return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
    var doc = node ? node.ownerDocument || node : preferredDoc,
        parent = doc.defaultView;

    // If no document and documentElement is available, return
    if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;
    }

    // Set our document
    document = doc;
    docElem = doc.documentElement;

    // Support tests
    documentIsHTML = !isXML( doc );

    // Support: IE>8
    // If iframe document is assigned to "document" variable and if iframe has been reloaded,
    // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
    // IE6-8 do not support the defaultView property so parent will be undefined
    if ( parent && parent.attachEvent && parent !== parent.top ) {
        parent.attachEvent( "onbeforeunload", function() {
            setDocument();
        });
    }

    /* Attributes
    ---------------------------------------------------------------------- */

    // Support: IE<8
    // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
    support.attributes = assert(function( div ) {
        div.className = "i";
        return !div.getAttribute("className");
    });

    /* getElement(s)By*
    ---------------------------------------------------------------------- */

    // Check if getElementsByTagName("*") returns only elements
    support.getElementsByTagName = assert(function( div ) {
        div.appendChild( doc.createComment("") );
        return !div.getElementsByTagName("*").length;
    });

    // Check if getElementsByClassName can be trusted
    support.getElementsByClassName = assert(function( div ) {
        div.innerHTML = "<div class='a'></div><div class='a i'></div>";

        // Support: Safari<4
        // Catch class over-caching
        div.firstChild.className = "i";
        // Support: Opera<10
        // Catch gEBCN failure to find non-leading classes
        return div.getElementsByClassName("i").length === 2;
    });

    // Support: IE<10
    // Check if getElementById returns elements by name
    // The broken getElementById methods don't pick up programatically-set names,
    // so use a roundabout getElementsByName test
    support.getById = assert(function( div ) {
        docElem.appendChild( div ).id = expando;
        return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
    });

    // ID find and filter
    if ( support.getById ) {
        Expr.find["ID"] = function( id, context ) {
            if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                var m = context.getElementById( id );
                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                return m && m.parentNode ? [m] : [];
            }
        };
        Expr.filter["ID"] = function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                return elem.getAttribute("id") === attrId;
            };
        };
    } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] =  function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                return node && node.value === attrId;
            };
        };
    }

    // Tag
    Expr.find["TAG"] = support.getElementsByTagName ?
        function( tag, context ) {
            if ( typeof context.getElementsByTagName !== strundefined ) {
                return context.getElementsByTagName( tag );
            }
        } :
        function( tag, context ) {
            var elem,
                tmp = [],
                i = 0,
                results = context.getElementsByTagName( tag );

            // Filter out possible comments
            if ( tag === "*" ) {
                while ( (elem = results[i++]) ) {
                    if ( elem.nodeType === 1 ) {
                        tmp.push( elem );
                    }
                }

                return tmp;
            }
            return results;
        };

    // Class
    Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
        if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
            return context.getElementsByClassName( className );
        }
    };

    /* QSA/matchesSelector
    ---------------------------------------------------------------------- */

    // QSA and matchesSelector support

    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    rbuggyMatches = [];

    // qSa(:focus) reports false when true (Chrome 21)
    // We allow this because of a bug in IE8/9 that throws an error
    // whenever `document.activeElement` is accessed on an iframe
    // So, we allow :focus to pass through QSA all the time to avoid the IE error
    // See http://bugs.jquery.com/ticket/13378
    rbuggyQSA = [];

    if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function( div ) {
            // Select is set to empty string on purpose
            // This is to test IE's treatment of not explicitly
            // setting a boolean content attribute,
            // since its presence should be enough
            // http://bugs.jquery.com/ticket/12359
            div.innerHTML = "<select><option selected=''></option></select>";

            // Support: IE8
            // Boolean attributes and "value" are not treated correctly
            if ( !div.querySelectorAll("[selected]").length ) {
                rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
            }

            // Webkit/Opera - :checked should return selected option elements
            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
            // IE8 throws error here and will not see later tests
            if ( !div.querySelectorAll(":checked").length ) {
                rbuggyQSA.push(":checked");
            }
        });

        assert(function( div ) {

            // Support: Opera 10-12/IE8
            // ^= $= *= and empty values
            // Should not select anything
            // Support: Windows 8 Native Apps
            // The type attribute is restricted during .innerHTML assignment
            var input = doc.createElement("input");
            input.setAttribute( "type", "hidden" );
            div.appendChild( input ).setAttribute( "t", "" );

            if ( div.querySelectorAll("[t^='']").length ) {
                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
            }

            // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
            // IE8 throws error here and will not see later tests
            if ( !div.querySelectorAll(":enabled").length ) {
                rbuggyQSA.push( ":enabled", ":disabled" );
            }

            // Opera 10-11 does not throw on post-comma invalid pseudos
            div.querySelectorAll("*,:x");
            rbuggyQSA.push(",.*:");
        });
    }

    if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector) )) ) {

        assert(function( div ) {
            // Check to see if it's possible to do matchesSelector
            // on a disconnected node (IE 9)
            support.disconnectedMatch = matches.call( div, "div" );

            // This should fail with an exception
            // Gecko does not error, returns false instead
            matches.call( div, "[s!='']:x" );
            rbuggyMatches.push( "!=", pseudos );
        });
    }

    rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
    rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

    /* Contains
    ---------------------------------------------------------------------- */

    // Element contains another
    // Purposefully does not implement inclusive descendent
    // As in, an element does not contain itself
    contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
        function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
                adown.contains ?
                    adown.contains( bup ) :
                    a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
            ));
        } :
        function( a, b ) {
            if ( b ) {
                while ( (b = b.parentNode) ) {
                    if ( b === a ) {
                        return true;
                    }
                }
            }
            return false;
        };

    /* Sorting
    ---------------------------------------------------------------------- */

    // Document order sorting
    sortOrder = docElem.compareDocumentPosition ?
    function( a, b ) {

        // Flag for duplicate removal
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

        if ( compare ) {
            // Disconnected nodes
            if ( compare & 1 ||
                (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

                // Choose the first element that is related to our preferred document
                if ( a === doc || contains(preferredDoc, a) ) {
                    return -1;
                }
                if ( b === doc || contains(preferredDoc, b) ) {
                    return 1;
                }

                // Maintain original order
                return sortInput ?
                    ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                    0;
            }

            return compare & 4 ? -1 : 1;
        }

        // Not directly comparable, sort on existence of method
        return a.compareDocumentPosition ? -1 : 1;
    } :
    function( a, b ) {
        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [ a ],
            bp = [ b ];

        // Exit early if the nodes are identical
        if ( a === b ) {
            hasDuplicate = true;
            return 0;

        // Parentless nodes are either documents or disconnected
        } else if ( !aup || !bup ) {
            return a === doc ? -1 :
                b === doc ? 1 :
                aup ? -1 :
                bup ? 1 :
                sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;

        // If the nodes are siblings, we can do a quick check
        } else if ( aup === bup ) {
            return siblingCheck( a, b );
        }

        // Otherwise we need full lists of their ancestors for comparison
        cur = a;
        while ( (cur = cur.parentNode) ) {
            ap.unshift( cur );
        }
        cur = b;
        while ( (cur = cur.parentNode) ) {
            bp.unshift( cur );
        }

        // Walk down the tree looking for a discrepancy
        while ( ap[i] === bp[i] ) {
            i++;
        }

        return i ?
            // Do a sibling check if the nodes have a common ancestor
            siblingCheck( ap[i], bp[i] ) :

            // Otherwise nodes in our document sort first
            ap[i] === preferredDoc ? -1 :
            bp[i] === preferredDoc ? 1 :
            0;
    };

    return doc;
};

Sizzle.matches = function( expr, elements ) {
    return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
    // Set document vars if needed
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    // Make sure that attribute selectors are quoted
    expr = expr.replace( rattributeQuotes, "='$1']" );

    if ( support.matchesSelector && documentIsHTML &&
        ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
        ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

        try {
            var ret = matches.call( elem, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
                    elem.document && elem.document.nodeType !== 11 ) {
                return ret;
            }
        } catch(e) {}
    }

    return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
    // Set document vars if needed
    if ( ( context.ownerDocument || context ) !== document ) {
        setDocument( context );
    }
    return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
    // Set document vars if needed
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    var fn = Expr.attrHandle[ name.toLowerCase() ],
        // Don't get fooled by Object.prototype properties (jQuery #13807)
        val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
            fn( elem, name, !documentIsHTML ) :
            undefined;

    return val !== undefined ?
        val :
        support.attributes || !documentIsHTML ?
            elem.getAttribute( name ) :
            (val = elem.getAttributeNode(name)) && val.specified ?
                val.value :
                null;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
    var elem,
        duplicates = [],
        j = 0,
        i = 0;

    // Unless we *know* we can detect duplicates, assume their presence
    hasDuplicate = !support.detectDuplicates;
    sortInput = !support.sortStable && results.slice( 0 );
    results.sort( sortOrder );

    if ( hasDuplicate ) {
        while ( (elem = results[i++]) ) {
            if ( elem === results[ i ] ) {
                j = duplicates.push( i );
            }
        }
        while ( j-- ) {
            results.splice( duplicates[ j ], 1 );
        }
    }

    return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
    var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

    if ( !nodeType ) {
        // If no nodeType, this is expected to be an array
        while ( (node = elem[i++]) ) {
            // Do not traverse comment nodes
            ret += getText( node );
        }
    } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (jQuery #11153)
        if ( typeof elem.textContent === "string" ) {
            return elem.textContent;
        } else {
            // Traverse its children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                ret += getText( elem );
            }
        }
    } else if ( nodeType === 3 || nodeType === 4 ) {
        return elem.nodeValue;
    }
    // Do not include comment or processing instruction nodes

    return ret;
};

Expr = Sizzle.selectors = {

    // Can be adjusted by the user
    cacheLength: 50,

    createPseudo: markFunction,

    match: matchExpr,

    attrHandle: {},

    find: {},

    relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" }
    },

    preFilter: {
        "ATTR": function( match ) {
            match[1] = match[1].replace( runescape, funescape );

            // Move the given value to match[3] whether quoted or unquoted
            match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

            if ( match[2] === "~=" ) {
                match[3] = " " + match[3] + " ";
            }

            return match.slice( 0, 4 );
        },

        "CHILD": function( match ) {
            /* matches from matchExpr["CHILD"]
                1 type (only|nth|...)
                2 what (child|of-type)
                3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                4 xn-component of xn+y argument ([+-]?\d*n|)
                5 sign of xn-component
                6 x of xn-component
                7 sign of y-component
                8 y of y-component
            */
            match[1] = match[1].toLowerCase();

            if ( match[1].slice( 0, 3 ) === "nth" ) {
                // nth-* requires argument
                if ( !match[3] ) {
                    Sizzle.error( match[0] );
                }

                // numeric x and y parameters for Expr.filter.CHILD
                // remember that false/true cast respectively to 0/1
                match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

            // other types prohibit arguments
            } else if ( match[3] ) {
                Sizzle.error( match[0] );
            }

            return match;
        },

        "PSEUDO": function( match ) {
            var excess,
                unquoted = !match[5] && match[2];

            if ( matchExpr["CHILD"].test( match[0] ) ) {
                return null;
            }

            // Accept quoted arguments as-is
            if ( match[3] && match[4] !== undefined ) {
                match[2] = match[4];

            // Strip excess characters from unquoted arguments
            } else if ( unquoted && rpseudo.test( unquoted ) &&
                // Get excess from tokenize (recursively)
                (excess = tokenize( unquoted, true )) &&
                // advance to the next closing parenthesis
                (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                // excess is a negative index
                match[0] = match[0].slice( 0, excess );
                match[2] = unquoted.slice( 0, excess );
            }

            // Return only captures needed by the pseudo filter method (type and argument)
            return match.slice( 0, 3 );
        }
    },

    filter: {

        "TAG": function( nodeNameSelector ) {
            var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
            return nodeNameSelector === "*" ?
                function() { return true; } :
                function( elem ) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                };
        },

        "CLASS": function( className ) {
            var pattern = classCache[ className + " " ];

            return pattern ||
                (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                classCache( className, function( elem ) {
                    return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
                });
        },

        "ATTR": function( name, operator, check ) {
            return function( elem ) {
                var result = Sizzle.attr( elem, name );

                if ( result == null ) {
                    return operator === "!=";
                }
                if ( !operator ) {
                    return true;
                }

                result += "";

                return operator === "=" ? result === check :
                    operator === "!=" ? result !== check :
                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                    operator === "$=" ? check && result.slice( -check.length ) === check :
                    operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                    operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                    false;
            };
        },

        "CHILD": function( type, what, argument, first, last ) {
            var simple = type.slice( 0, 3 ) !== "nth",
                forward = type.slice( -4 ) !== "last",
                ofType = what === "of-type";

            return first === 1 && last === 0 ?

                // Shortcut for :nth-*(n)
                function( elem ) {
                    return !!elem.parentNode;
                } :

                function( elem, context, xml ) {
                    var cache, outerCache, node, diff, nodeIndex, start,
                        dir = simple !== forward ? "nextSibling" : "previousSibling",
                        parent = elem.parentNode,
                        name = ofType && elem.nodeName.toLowerCase(),
                        useCache = !xml && !ofType;

                    if ( parent ) {

                        // :(first|last|only)-(child|of-type)
                        if ( simple ) {
                            while ( dir ) {
                                node = elem;
                                while ( (node = node[ dir ]) ) {
                                    if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                        return false;
                                    }
                                }
                                // Reverse direction for :only-* (if we haven't yet done so)
                                start = dir = type === "only" && !start && "nextSibling";
                            }
                            return true;
                        }

                        start = [ forward ? parent.firstChild : parent.lastChild ];

                        // non-xml :nth-child(...) stores cache data on `parent`
                        if ( forward && useCache ) {
                            // Seek `elem` from a previously-cached index
                            outerCache = parent[ expando ] || (parent[ expando ] = {});
                            cache = outerCache[ type ] || [];
                            nodeIndex = cache[0] === dirruns && cache[1];
                            diff = cache[0] === dirruns && cache[2];
                            node = nodeIndex && parent.childNodes[ nodeIndex ];

                            while ( (node = ++nodeIndex && node && node[ dir ] ||

                                // Fallback to seeking `elem` from the start
                                (diff = nodeIndex = 0) || start.pop()) ) {

                                // When found, cache indexes on `parent` and break
                                if ( node.nodeType === 1 && ++diff && node === elem ) {
                                    outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            }

                        // Use previously-cached element index if available
                        } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                            diff = cache[1];

                        // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                        } else {
                            // Use the same loop as above to seek `elem` from the start
                            while ( (node = ++nodeIndex && node && node[ dir ] ||
                                (diff = nodeIndex = 0) || start.pop()) ) {

                                if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                    // Cache the index of each encountered element
                                    if ( useCache ) {
                                        (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                    }

                                    if ( node === elem ) {
                                        break;
                                    }
                                }
                            }
                        }

                        // Incorporate the offset, then check against cycle size
                        diff -= last;
                        return diff === first || ( diff % first === 0 && diff / first >= 0 );
                    }
                };
        },

        "PSEUDO": function( pseudo, argument ) {
            // pseudo-class names are case-insensitive
            // http://www.w3.org/TR/selectors/#pseudo-classes
            // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
            // Remember that setFilters inherits from pseudos
            var args,
                fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                    Sizzle.error( "unsupported pseudo: " + pseudo );

            // The user may use createPseudo to indicate that
            // arguments are needed to create the filter function
            // just as Sizzle does
            if ( fn[ expando ] ) {
                return fn( argument );
            }

            // But maintain support for old signatures
            if ( fn.length > 1 ) {
                args = [ pseudo, pseudo, "", argument ];
                return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                    markFunction(function( seed, matches ) {
                        var idx,
                            matched = fn( seed, argument ),
                            i = matched.length;
                        while ( i-- ) {
                            idx = indexOf.call( seed, matched[i] );
                            seed[ idx ] = !( matches[ idx ] = matched[i] );
                        }
                    }) :
                    function( elem ) {
                        return fn( elem, 0, args );
                    };
            }

            return fn;
        }
    },

    pseudos: {
        // Potentially complex pseudos
        "not": markFunction(function( selector ) {
            // Trim the selector passed to compile
            // to avoid treating leading and trailing
            // spaces as combinators
            var input = [],
                results = [],
                matcher = compile( selector.replace( rtrim, "$1" ) );

            return matcher[ expando ] ?
                markFunction(function( seed, matches, context, xml ) {
                    var elem,
                        unmatched = matcher( seed, null, xml, [] ),
                        i = seed.length;

                    // Match elements unmatched by `matcher`
                    while ( i-- ) {
                        if ( (elem = unmatched[i]) ) {
                            seed[i] = !(matches[i] = elem);
                        }
                    }
                }) :
                function( elem, context, xml ) {
                    input[0] = elem;
                    matcher( input, null, xml, results );
                    return !results.pop();
                };
        }),

        "has": markFunction(function( selector ) {
            return function( elem ) {
                return Sizzle( selector, elem ).length > 0;
            };
        }),

        "contains": markFunction(function( text ) {
            return function( elem ) {
                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
            };
        }),

        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        "lang": markFunction( function( lang ) {
            // lang value must be a valid identifier
            if ( !ridentifier.test(lang || "") ) {
                Sizzle.error( "unsupported lang: " + lang );
            }
            lang = lang.replace( runescape, funescape ).toLowerCase();
            return function( elem ) {
                var elemLang;
                do {
                    if ( (elemLang = documentIsHTML ?
                        elem.lang :
                        elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                        elemLang = elemLang.toLowerCase();
                        return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                    }
                } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                return false;
            };
        }),

        // Miscellaneous
        "target": function( elem ) {
            var hash = window.location && window.location.hash;
            return hash && hash.slice( 1 ) === elem.id;
        },

        "root": function( elem ) {
            return elem === docElem;
        },

        "focus": function( elem ) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },

        // Boolean properties
        "enabled": function( elem ) {
            return elem.disabled === false;
        },

        "disabled": function( elem ) {
            return elem.disabled === true;
        },

        "checked": function( elem ) {
            // In CSS3, :checked should return both checked and selected elements
            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
            var nodeName = elem.nodeName.toLowerCase();
            return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },

        "selected": function( elem ) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }

            return elem.selected === true;
        },

        // Contents
        "empty": function( elem ) {
            // http://www.w3.org/TR/selectors/#empty-pseudo
            // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
            //   but not by others (comment: 8; processing instruction: 7; etc.)
            // nodeType < 6 works because attributes (2) do not appear as children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                if ( elem.nodeType < 6 ) {
                    return false;
                }
            }
            return true;
        },

        "parent": function( elem ) {
            return !Expr.pseudos["empty"]( elem );
        },

        // Element/input types
        "header": function( elem ) {
            return rheader.test( elem.nodeName );
        },

        "input": function( elem ) {
            return rinputs.test( elem.nodeName );
        },

        "button": function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === "button" || name === "button";
        },

        "text": function( elem ) {
            var attr;
            return elem.nodeName.toLowerCase() === "input" &&
                elem.type === "text" &&

                // Support: IE<8
                // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
        },

        // Position-in-collection
        "first": createPositionalPseudo(function() {
            return [ 0 ];
        }),

        "last": createPositionalPseudo(function( matchIndexes, length ) {
            return [ length - 1 ];
        }),

        "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
            return [ argument < 0 ? argument + length : argument ];
        }),

        "even": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 0;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "odd": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 1;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; --i >= 0; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; ++i < length; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        })
    }
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
    Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
    var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[ selector + " " ];

    if ( cached ) {
        return parseOnly ? 0 : cached.slice( 0 );
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while ( soFar ) {

        // Comma and first run
        if ( !matched || (match = rcomma.exec( soFar )) ) {
            if ( match ) {
                // Don't consume trailing commas as valid
                soFar = soFar.slice( match[0].length ) || soFar;
            }
            groups.push( (tokens = []) );
        }

        matched = false;

        // Combinators
        if ( (match = rcombinators.exec( soFar )) ) {
            matched = match.shift();
            tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace( rtrim, " " )
            });
            soFar = soFar.slice( matched.length );
        }

        // Filters
        for ( type in Expr.filter ) {
            if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                (match = preFilters[ type ]( match ))) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                });
                soFar = soFar.slice( matched.length );
            }
        }

        if ( !matched ) {
            break;
        }
    }

    // Return the length of the invalid excess
    // if we're just parsing
    // Otherwise, throw an error or return tokens
    return parseOnly ?
        soFar.length :
        soFar ?
            Sizzle.error( selector ) :
            // Cache the tokens
            tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
    var i = 0,
        len = tokens.length,
        selector = "";
    for ( ; i < len; i++ ) {
        selector += tokens[i].value;
    }
    return selector;
}

function addCombinator( matcher, combinator, base ) {
    var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;

    return combinator.first ?
        // Check against closest ancestor/preceding element
        function( elem, context, xml ) {
            while ( (elem = elem[ dir ]) ) {
                if ( elem.nodeType === 1 || checkNonElements ) {
                    return matcher( elem, context, xml );
                }
            }
        } :

        // Check against all ancestor/preceding elements
        function( elem, context, xml ) {
            var data, cache, outerCache,
                dirkey = dirruns + " " + doneName;

            // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
            if ( xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        if ( matcher( elem, context, xml ) ) {
                            return true;
                        }
                    }
                }
            } else {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        outerCache = elem[ expando ] || (elem[ expando ] = {});
                        if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                            if ( (data = cache[1]) === true || data === cachedruns ) {
                                return data === true;
                            }
                        } else {
                            cache = outerCache[ dir ] = [ dirkey ];
                            cache[1] = matcher( elem, context, xml ) || cachedruns;
                            if ( cache[1] === true ) {
                                return true;
                            }
                        }
                    }
                }
            }
        };
}

function elementMatcher( matchers ) {
    return matchers.length > 1 ?
        function( elem, context, xml ) {
            var i = matchers.length;
            while ( i-- ) {
                if ( !matchers[i]( elem, context, xml ) ) {
                    return false;
                }
            }
            return true;
        } :
        matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
    var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

    for ( ; i < len; i++ ) {
        if ( (elem = unmatched[i]) ) {
            if ( !filter || filter( elem, context, xml ) ) {
                newUnmatched.push( elem );
                if ( mapped ) {
                    map.push( i );
                }
            }
        }
    }

    return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    if ( postFilter && !postFilter[ expando ] ) {
        postFilter = setMatcher( postFilter );
    }
    if ( postFinder && !postFinder[ expando ] ) {
        postFinder = setMatcher( postFinder, postSelector );
    }
    return markFunction(function( seed, results, context, xml ) {
        var temp, i, elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,

            // Get initial elements from seed or context
            elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

            // Prefilter to get matcher input, preserving a map for seed-results synchronization
            matcherIn = preFilter && ( seed || !selector ) ?
                condense( elems, preMap, preFilter, context, xml ) :
                elems,

            matcherOut = matcher ?
                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                    // ...intermediate processing is necessary
                    [] :

                    // ...otherwise use results directly
                    results :
                matcherIn;

        // Find primary matches
        if ( matcher ) {
            matcher( matcherIn, matcherOut, context, xml );
        }

        // Apply postFilter
        if ( postFilter ) {
            temp = condense( matcherOut, postMap );
            postFilter( temp, [], context, xml );

            // Un-match failing elements by moving them back to matcherIn
            i = temp.length;
            while ( i-- ) {
                if ( (elem = temp[i]) ) {
                    matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                }
            }
        }

        if ( seed ) {
            if ( postFinder || preFilter ) {
                if ( postFinder ) {
                    // Get the final matcherOut by condensing this intermediate into postFinder contexts
                    temp = [];
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) ) {
                            // Restore matcherIn since elem is not yet a final match
                            temp.push( (matcherIn[i] = elem) );
                        }
                    }
                    postFinder( null, (matcherOut = []), temp, xml );
                }

                // Move matched elements from seed to results to keep them synchronized
                i = matcherOut.length;
                while ( i-- ) {
                    if ( (elem = matcherOut[i]) &&
                        (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                        seed[temp] = !(results[temp] = elem);
                    }
                }
            }

        // Add elements to results, through postFinder if defined
        } else {
            matcherOut = condense(
                matcherOut === results ?
                    matcherOut.splice( preexisting, matcherOut.length ) :
                    matcherOut
            );
            if ( postFinder ) {
                postFinder( null, results, matcherOut, xml );
            } else {
                push.apply( results, matcherOut );
            }
        }
    });
}

function matcherFromTokens( tokens ) {
    var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[ tokens[0].type ],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

        // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator( function( elem ) {
            return elem === checkContext;
        }, implicitRelative, true ),
        matchAnyContext = addCombinator( function( elem ) {
            return indexOf.call( checkContext, elem ) > -1;
        }, implicitRelative, true ),
        matchers = [ function( elem, context, xml ) {
            return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                (checkContext = context).nodeType ?
                    matchContext( elem, context, xml ) :
                    matchAnyContext( elem, context, xml ) );
        } ];

    for ( ; i < len; i++ ) {
        if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
            matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
        } else {
            matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

            // Return special upon seeing a positional matcher
            if ( matcher[ expando ] ) {
                // Find the next relative operator (if any) for proper handling
                j = ++i;
                for ( ; j < len; j++ ) {
                    if ( Expr.relative[ tokens[j].type ] ) {
                        break;
                    }
                }
                return setMatcher(
                    i > 1 && elementMatcher( matchers ),
                    i > 1 && toSelector(
                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                        tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                    ).replace( rtrim, "$1" ),
                    matcher,
                    i < j && matcherFromTokens( tokens.slice( i, j ) ),
                    j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                    j < len && toSelector( tokens )
                );
            }
            matchers.push( matcher );
        }
    }

    return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    // A counter to specify which element is currently being matched
    var matcherCachedRuns = 0,
        bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function( seed, context, xml, results, outermost ) {
            var elem, j, matcher,
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                setMatched = [],
                contextBackup = outermostContext,
                // We must always have either seed elements or outermost context
                elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                // Use integer dirruns iff this is the outermost matcher
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                len = elems.length;

            if ( outermost ) {
                outermostContext = context !== document && context;
                cachedruns = matcherCachedRuns;
            }

            // Add elements passing elementMatchers directly to results
            // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
            // Support: IE<9, Safari
            // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
            for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                if ( byElement && elem ) {
                    j = 0;
                    while ( (matcher = elementMatchers[j++]) ) {
                        if ( matcher( elem, context, xml ) ) {
                            results.push( elem );
                            break;
                        }
                    }
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                        cachedruns = ++matcherCachedRuns;
                    }
                }

                // Track unmatched elements for set filters
                if ( bySet ) {
                    // They will have gone through all possible matchers
                    if ( (elem = !matcher && elem) ) {
                        matchedCount--;
                    }

                    // Lengthen the array for every element, matched or not
                    if ( seed ) {
                        unmatched.push( elem );
                    }
                }
            }

            // Apply set filters to unmatched elements
            matchedCount += i;
            if ( bySet && i !== matchedCount ) {
                j = 0;
                while ( (matcher = setMatchers[j++]) ) {
                    matcher( unmatched, setMatched, context, xml );
                }

                if ( seed ) {
                    // Reintegrate element matches to eliminate the need for sorting
                    if ( matchedCount > 0 ) {
                        while ( i-- ) {
                            if ( !(unmatched[i] || setMatched[i]) ) {
                                setMatched[i] = pop.call( results );
                            }
                        }
                    }

                    // Discard index placeholder values to get only actual matches
                    setMatched = condense( setMatched );
                }

                // Add matches to results
                push.apply( results, setMatched );

                // Seedless set matches succeeding multiple successful matchers stipulate sorting
                if ( outermost && !seed && setMatched.length > 0 &&
                    ( matchedCount + setMatchers.length ) > 1 ) {

                    Sizzle.uniqueSort( results );
                }
            }

            // Override manipulation of globals by nested matchers
            if ( outermost ) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }

            return unmatched;
        };

    return bySet ?
        markFunction( superMatcher ) :
        superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
    var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[ selector + " " ];

    if ( !cached ) {
        // Generate a function of recursive functions that can be used to check each element
        if ( !group ) {
            group = tokenize( selector );
        }
        i = group.length;
        while ( i-- ) {
            cached = matcherFromTokens( group[i] );
            if ( cached[ expando ] ) {
                setMatchers.push( cached );
            } else {
                elementMatchers.push( cached );
            }
        }

        // Cache the compiled function
        cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
    }
    return cached;
};

function multipleContexts( selector, contexts, results ) {
    var i = 0,
        len = contexts.length;
    for ( ; i < len; i++ ) {
        Sizzle( selector, contexts[i], results );
    }
    return results;
}

function select( selector, context, results, seed ) {
    var i, tokens, token, type, find,
        match = tokenize( selector );

    if ( !seed ) {
        // Try to minimize operations if there is only one group
        if ( match.length === 1 ) {

            // Take a shortcut and set the context if the root selector is an ID
            tokens = match[0] = match[0].slice( 0 );
            if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                    support.getById && context.nodeType === 9 && documentIsHTML &&
                    Expr.relative[ tokens[1].type ] ) {

                context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                if ( !context ) {
                    return results;
                }
                selector = selector.slice( tokens.shift().value.length );
            }

            // Fetch a seed set for right-to-left matching
            i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
            while ( i-- ) {
                token = tokens[i];

                // Abort if we hit a combinator
                if ( Expr.relative[ (type = token.type) ] ) {
                    break;
                }
                if ( (find = Expr.find[ type ]) ) {
                    // Search, expanding context for leading sibling combinators
                    if ( (seed = find(
                        token.matches[0].replace( runescape, funescape ),
                        rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                    )) ) {

                        // If seed is empty or no tokens remain, we can return early
                        tokens.splice( i, 1 );
                        selector = seed.length && toSelector( tokens );
                        if ( !selector ) {
                            push.apply( results, seed );
                            return results;
                        }

                        break;
                    }
                }
            }
        }
    }

    // Compile and execute a filtering function
    // Provide `match` to avoid retokenization if we modified the selector above
    compile( selector, match )(
        seed,
        context,
        !documentIsHTML,
        results,
        rsibling.test( selector ) && testContext( context.parentNode ) || context
    );
    return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
    // Should return 1, but returns 4 (following)
    return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild.getAttribute("href") === "#" ;
}) ) {
    addHandle( "type|href|height|width", function( elem, name, isXML ) {
        if ( !isXML ) {
            return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
        }
    });
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
    div.innerHTML = "<input/>";
    div.firstChild.setAttribute( "value", "" );
    return div.firstChild.getAttribute( "value" ) === "";
}) ) {
    addHandle( "value", function( elem, name, isXML ) {
        if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
            return elem.defaultValue;
        }
    });
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
    return div.getAttribute("disabled") == null;
}) ) {
    addHandle( booleans, function( elem, name, isXML ) {
        var val;
        if ( !isXML ) {
            return elem[ name ] === true ? name.toLowerCase() :
                    (val = elem.getAttributeNode( name )) && val.specified ?
                    val.value :
                null;
        }
    });
}

// EXPOSE
if ( typeof define === "function" && define.amd ) {
    define(function() { return Sizzle; });
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
    module.exports = Sizzle;
} else {
    window.Sizzle = Sizzle;
}
// EXPOSE

Ys.find = Sizzle;

})( window );

//var $ = Ys;
Ys.documentComplete = function(fn) {
    document.onreadystatechange = function() {
        if(document.readyState === "complete")
        {
            if(typeof(fn) === 'function')fn();
            //console.log(Ys.$('password').element.value);
        }
    };
};
/*
Ys.getElementsByClassName = function (searchClass, node,tag) {
    var result=[];
    if(document.getElementsByClassName) {
        var nodes =  (node || document).getElementsByClassName(searchClass);
        for(var i=0 ;node = nodes[i++]; ) {
            if(tag !== "*" && node.tagName === tag.toUpperCase()) {
                result.push(node);
            }
        }
        return result;
    }else{
        node = node || document;
        tag = tag || "*";
        var classes = searchClass.split(" "),
        elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),
        patterns = [],
        current,
        match;
        for( var l = 0;l<classes.length;l++) {
            patterns.push(new RegExp("(^|\\s)" + classes[l] + "(\\s|$)"));
        }
        for( var j = 0;j<elements.length;j++) {
            current = elements[j];
            match = false;
            for(var k=0, kl=patterns.length; k<kl; k++){
                match = patterns[k].test(current.className);
                if (!match)  break;
        }
        if (match)  result.push(current);
    }
    return result;
    }
};
*/
 /*这里借用一下jquery的函数，返回浏览器的vendor前缀*/
Ys.getVendorPrefix = function(index) {
    var body, i, style, transition, vendor ,transEndEventNames,animationEndEventNames;
    body = document.body || document.documentElement;
    style = body.style;
    transition = "transition";
    vendor = ["Moz", "Webkit", "O", "ms", "Khtml"];
    transEndEventNames = ["transitionend", "webkitTransitionEnd", "oTransitionEnd otransitionend", "MSTransitionEnd", "transitionend"];
    animationEndEventNames = ["animationend", "webkitAnimationEnd", "oAnimationEnd oanimationend", "MSAnimationEnd", "animationend"];
    transition = transition.charAt(0).toUpperCase() + transition.substr(1);
    i = 0;
    while (i < vendor.length) {
        if (typeof style[vendor[i] + transition] ===  "string") {
            if(index ==1)return vendor[i];
            if(index ==2)return transEndEventNames[i];
            if(index ==3)return animationEndEventNames[i];
        }
        i++;
    }
    return false;
};


Ys.vendorPrefix = Ys.getVendorPrefix(1);
Ys.vendorTransitionEnd = Ys.getVendorPrefix(2);
Ys.vendorAnimationEnd = Ys.getVendorPrefix(3);

/*判断是否为ie浏览器及其版本*/
Ys._IEVersion = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0")?6:
    (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")?7:
    (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")?8:
    (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0")?9:
    (navigator.appName == "Microsoft Internet Explorer")?10:undefined;

Ys.addEventListener = function(element,type,fn) {
    if(typeof element == 'undefined') return false;
     if(element.addEventListener) {
        element.addEventListener(type,fn,false);
    }
    else if(element.attachEvent) {
    //将事件缓冲到该标签上,已解决this指向window(现fn内this指向element)和移除匿名事件问题
        var _EventRef ='_'+type+'EventRef';
        if(!element[_EventRef]) {
            element[_EventRef]=[];
        }
        var _EventRefs = element[_EventRef];
        var index;
        for(index in _EventRefs) {
            if(_EventRefs[index]['realFn'] == fn) {
                return;
            }
        }
        //propertychange事件统一为input事件
        if(type == 'input')type = 'propertychange';
        var nestFn = function() {
            fn.apply(element,arguments);
        };
        element[_EventRef].push( {'realFn':fn,'nestFn':nestFn});
        element.attachEvent('on'+type,nestFn);
    }else {
        element['on'+type] = fn;
    }
};

Ys.removeListener = function(element,type,fn) {
    if(typeof element == 'undefined') return false;
    if(element.removeEventListener) {
        element.removeEventListener(type,fn,false);
    }
    else if(element.detachEvent) {
        var _EventRef ='_'+type+'EventRef';
        if(!element[_EventRef]) {
            element[_EventRef]=[];
        }
        var _EventRefs = element[_EventRef];
        var index;
        var nestFn;
        for(index in _EventRefs) {
            if(_EventRefs[index]['realFn'] == fn) {
                nestFn = _EventRefs[index]['nestFn'];
                if(index ==_EventRefs.length-1) {
                    element[_EventRef] = _EventRefs.slice(0,index);
                }else {
                    element[_EventRef] = _EventRefs.slice(0,index).concat(_EventRefs.slice(index+1,_EventRefs.length-1));
                }
                break;
            }
        }
        //propertychange事件统一为input事件
        if(type == 'input')type = 'propertychange';
        if(nestFn) {
        element.detachEvent('on'+type,nestFn);
        }
    } else {
        element['on'+type] = null;
    }
};

Ys.stopDefault = function(e) {
    if (e && e.preventDefault) {//如果是FF下执行这个
        e.preventDefault();
    } else {
        window.event.returnValue = false;//如果是IE下执行这个
    }
    return false;
};

Ys.addClass = function(element,className) {
    var classArray = null;
    var c = false;
    try {
        classArray = element.className.split(' ');
        for(var i = 0;i<classArray.length;i++) {
            if(classArray[i] == className)c = true;
        }
        if(!c)classArray.push(className);
        element.className = classArray.join(' ');
    }catch(e) {}
};

Ys.removeClass = function(element,className) {
    var classArray = null;
    var newClassArray = [];
    var c = false;
    try {
        classArray = element.className.split(' ');
        for(var i = 0;i<classArray.length;i++) {
            if(classArray[i] !== className)newClassArray.push(classArray[i]);
        }
         element.className = newClassArray.join(' ');
    }catch(e) {}
};


/**
 * 2012.8.20
 *
 * ajax控件
 *
 *
 */

Ys.ajax = function(options) {
    
    if(typeof options !=='object')options = {};
    
    options = {
        type: options.type || 'POST',
        url: options.url || '',
        async: options.async || 'ture',
        timeout: options.timeout || 5000,
        onComplete: options.onComplete || function() {},
        onError: options.onError || function() {},
        onSuccess: options.onSuccess || function() {},
        onSend: options.onSend || function() {},
        onTimeout: options.onTimeout || function() {},
        acceptdatatype: options.acceptdatatype || 'json',
        data: options.data || '',
        hasFile:options.hasFile|| false,
        formDom:options.formDom|| null,
        files:options.files || null
    };
    
    
    var self = this;
    
    self.Ajax = null;
    
    var createAjaxRequest = function() {
        if (typeof XMLHttpRequest == 'undefined')
        {
            self.Ajax = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            self.Ajax = new XMLHttpRequest();
        }
    };
    
    /*超时时间*/
    var timer;
    
    
    var send = function() {
        
        self.Ajax.open(options.type, options.url, options.async);
    
        if (options.type == 'GET') {
            self.Ajax.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
            self.Ajax.send();
        }else {
            switch (options.acceptdatatype) {
            case 'json':
                self.Ajax.setRequestHeader("Accept", 'application/json, text/javascript');
                break;
            default:
                self.Ajax.setRequestHeader("Accept", 'application/json, text/javascript');
            }
        }
        
        
        self.Ajax.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
        self.Ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        self.Ajax.send(options.data);
        timer = setTimeout(function() {
            if (typeof options.onTimeout == "function") options.onTimeout();
            if (self.Ajax) {
                self.Ajax.abort();
                self.Ajax = null;
            }
            return 0;
        },options.timeout);
    };
    
    
    
    
    var stateHandler = function() {
        switch (self.Ajax.readyState) {
            case 1:
                break;
            case 2:options.onSend();
                break;
            case 3:
                break;
            case 4:
                try {
                switch (self.Ajax.status) {
                    case 200:
                        if(timer)clearTimeout(timer);
                        if(typeof options.onSuccess ===  'function')options.onSuccess(self.Ajax.responseText);
                        if(typeof options.onComplete ===  'function')options.onComplete(self.Ajax.responseText);
                        break;
                    case 404:
                        if (timer) clearTimeout(timer);
                        if(typeof options.onError ===  'function')options.onError(self.Ajax.responseText);
                        options.onComplete(Ajax.responseText);
                        break;
                    default:
                        if (timer) clearTimeout(timer);
                        if(typeof options.onComplete ===  'function')options.onComplete(self.Ajax.responseText);
                    }
                }catch(e) {}
                break;
            default:
                break;
        }
    };
    
    
    
    var XHR2Send = function(file) {
        
        if(!file.files.length)
        return;
            
        var formData = new FormData();
        //XMLHttpRequest2 对象，支持上传文件
        self.xhr2 = new XMLHttpRequest();
        //已上传字节数
        var uploadedBytes = 0;
        //文件总字节数
        var totalBytes = 0;
        formData.append(file.name,file.files[0]);
        Ys.addEventListener(self.xhr2.upload,'progress',function(e) {
            if (e.lengthComputable) {
                uploadedBytes = e.loaded;
                totalBytes = e.total;
                var percentComplete = Math.round(uploadedBytes * 100 / totalBytes),
                //已上传文件大小
                bytesTransfered = '';
                if (uploadedBytes > 1024 * 1024)bytesTransfered = Math.round(uploadedBytes * 100 / (1024 * 1024)) / 100 + 'MB';
                else bytesTransfered = Math.round(uploadedBytes * 100 / 1024) / 100 + 'KB';
                //console.log(bytesTransfered);
                //上传完成，显示上传文件信息
                if(percentComplete ===  100) {}
            } else {
            }
        });
        
        Ys.addEventListener(self.xhr2,'load',function(e) {
            if(typeof(options.onSuccess)=='function') {
                options.onSuccess(e.target.responseText);
            }
            self.destruct();
        });
        Ys.addEventListener(self.xhr2,'abort',function(e) {
            self.destruct();
        });
        Ys.addEventListener(self.xhr2,'error',function(e) {
            if(typeof(options.onError)=='function') {
                options.onError(e.target.responseText);
            }
            self.destruct();
        });
        
            
        self.xhr2.open(options.type,options.url,options.async);
        self.xhr2.send(formData);
     };
     var createIframe = function(id, uri) {
        //create frame
        var frameId = 'iframe' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if(window.ActiveXObject)
        {
            if(typeof uri== 'boolean'){
                iframeHtml += ' src="' + 'javascript:false' + '"';
            }
            else if(typeof uri== 'string'){
                iframeHtml += ' src="' + uri + '"';
            }
        }
        iframeHtml += ' />';
         jQuery(iframeHtml).appendTo(document.body);
         //var tmp = document.createElement('div');
        //document.body.insertBefore(tmp,document.body.firstChild);
        //tmp.innerHTML=iframeHtml;
         return Ys(frameId).element;
    };
     var createForm = function(id, fileElement, data) {
        var formId = 'Form' + id;
        var fileId = 'File' + id;
        var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');    
        if(data)
        {
            for(var i in data)
            {
                jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
            }            
        }        
        var oldElement = jQuery(fileElement);
        var newElement = jQuery(oldElement).clone();
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);
         //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');        
        return form;
    };
     var useIframeInit = function(){
        var id = new Date().getTime();
        self.iframe = createIframe(id);
        self.form = createForm(id,options.files,(typeof(options.data)=='undefined'?false:options.data));
        var frameId = 'iframe' + id;
        var formId = 'form' + id;
         var requestDone = false;
        // Create the request object
        var xml = {};
        // Wait for a response to come back
        var uploadCallback = function(isTimeout) {
            var io = document.getElementById(frameId);
            try {
                if(io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                    xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
                } else if(io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                    xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
                }
            } catch(e) {
                //jQuery.handleError(s, xml, null, e);
            }
            if ( xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" ) {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = xml.responseText ? xml.responseText : xml.responseXML;
                        // If a local callback was specified, fire it and pass it the data
                        if ( options.onSuccess ) options.onSuccess( data, status );
                     } //else console.log(e);//jQuery.handleError(s, xml, status);
                } catch(e) {
                    status = "error";
                    //jQuery.handleError(s, xml, status, e);
                }
                 // Process result
                if ( options.onComplete )
                    options.onComplete(xml, status);
                 jQuery(io).unbind();
                 setTimeout(function()
                                {    try {
                                        jQuery(io).remove();
                                        self.form.remove();
                                    } catch(e) {
                                        //console.log(e);
                                        //jQuery.handleError(s, xml, null, e);
                                    }                            
                                 }, 100);
                 xml = null;
            }
        };
        // Timeout checker
        if ( options.timeout > 0 ) {
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, options.timeout);
        }
        try {
            self.form.attr('action', options.url);
            self.form.attr('method', 'POST');
            self.form.attr('target', frameId);
            if(self.form.encoding) {
                self.form.attr('encoding', 'multipart/form-data');
            } else {
                self.form.attr('enctype', 'multipart/form-data');
            }
            self.form.submit();
        } catch(e) {
            jQuery.handleError(s, xml, null, e);
        }
        jQuery('#' + frameId).load(uploadCallback);
        return {abort: function () {}};
    };
    
    
    var iframeSend = function() {
        
     };
     self.destruct = function() {
        try{
            self.iframe.src ='';
            searchClassf.iframe.parentNode.removeChild(self.iframe);
            self.iframe = null;
            Ys.removeListener(self.xhr2.upload,'progress');
            Ys.removeListener(self.xhr2,'load');
            Ys.removeListener(self.xhr2,'abort');
            Ys.removeListener(self.xhr2,'error');
            self.xhr2 = null;
        }catch(e){}
    };
    
    var run = function() {
        if(options.hasFile) {
            /*html5上传*/
            if(typeof(window.FileReader) === 'function'){
                self.Ajax =new XHR2Send(options.files);
            } else {
            /*iframe上传*/
                useIframeInit();
                iframeSend();
            }
        }else {
            createAjaxRequest();
            self.Ajax.onreadystatechange = stateHandler;
            send();
        }
    };
    
    run();

};


/*几个常用的tween算法*/
Ys.Tween = {
    Linear: function( t, b, c, d) { return c*t/d + b; },
    Quad: {
        easeIn: function(t,b,c,d) {
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d) {
            if ((t/=d/2) < 1) {return c/2*t*t + b;}
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
    Quart: {
        easeIn: function(t,b,c,d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d) {
            return -c * ((t = t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d) {
            if ((t/=d/2) < 1) {return c/2*t*t*t*t + b;}
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
    Back: {
        easeOut: function(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
    },
    Bounce: {
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        }
    }
};

/*
* 2013.3.27
*
* eachSlide插件    
* 
* 第一种思路解决方案:
*    将每个要滑动的元素分别生成object,独立的进行slide
*    移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
*    此种思路不适合广告位,更适合一个展区多个frame或多个模块的滑动    
*
* 最近参考了大量滑动的插件，发现这种方式并不适用，理由如下：
* 1.每个滑动元素单独生成一个实例，之间的关联性较难达到统一控制。要对整体的移动或效果进行操作，
* 程序复杂性方面过高，暂时无法实现
* 2.测试了大部分浏览器，在滑动过程中，由于元素单独生成实例，初始化（init）有时间上的先后，
* 在slide过程中元素之间会有空隙存在。
* 
*/

Ys.eachSlide = function(options) {
    
    if(typeof options != 'object')options = {};
    
    /*不知道这个要怎么描述了*/
    var self = this;
    
    /*初始排位*/
    var defaultIndex;
    
    /*延迟容器*/
    var moveOnceTimeOutID;
    var runTimeOutID;
    var runOn = 1;
    var runtimeControlID;
    
    var totalItemNum = options.totalItemNum||5;
    var viewItemNum = options.viewItemNum||4;
    var targetPrefix = options.targetPrefix||'slideItem';
    var startTime = options.startTime||0;//开始时间
    var startPosition = options.startPosition||0;//初始偏移位置
    var duration = options.duration||100;//持续时间
    var step = options.step||1;/*每次tween移动像素*/
    var stepTime = options.stepTime||1;/*每次tween移动时间*/
    var tween = options.tween||'Linear';/*tween算子*/
    var parent = Ys('#'+options.parentID).element;
    var delay = options.delay||2000;/*每次移动后延迟时间*/
    var direction = options.direction||'left';/*支持向左或向右*/
    
        
    /*初始化*/
    self.init = function(options) {
        defaultIndex = self.index = options.index||0;/*当前target排位*/
        self.target = Ys('#'+targetPrefix+self.index).element;/*初始化时使用index*/
        self.targetWidth = self.target.offsetWidth;
        self.variation = options.variation||self.targetWidth;/*目的地相对初始位置移动增量*/
    };
    
    /*单次移动*/
    var moveOnce = function(position,tempDirection,callback) {
        /*position为当前target距左边位置*/
        var startTimeTemp = startTime;
        var variation = self.variation;
        var doMove = function() {
            switch (tempDirection) {
            case 'left':startTimeTemp -= stepTime;/*向左滑动*/
                break;
            case 'right':startTimeTemp += stepTime;/*向右滑动*/
                break;
            default:startTimeTemp -= stepTime;
            }
            self.target.style.left =(Math.ceil(position)+Math.ceil(Ys.Tween.Quart.easeIn(startTimeTemp,startPosition,variation,duration)))+'px';
            if(Math.abs(startTimeTemp)<duration) {
                moveOnceTimeOutID = setTimeout(doMove,stepTime);
            }
            else {
                clearTimeout(moveOnceTimeOutID);callback();
            }
        };
        doMove();
    };
    
    
    /*滑动至下一个*/
    var next = function(callback) {
        var position = self.index*self.variation;
        moveOnce(position,direction,function() {
            switch (direction) {
                case 'left':self.index--;/*向左滑动*/
                    break;
                case 'right':self.index++;/*向右滑动*/
                    break;
                default:self.index--;
            }
            callback();
        });
    };
    
    /*滑动至上一个*/
    var previous = function() {
        var position = self.index*self.variation;
        moveOnce(position,(direction =='left'?'right':'left'),function() {
            switch (direction) {
                case 'left':self.index++;/*向左滑动*/
                    break;
                case 'right':self.index--;/*向右滑动*/
                    break;
                default:self.index--;
            }
        });
    };
    
    self.toPrevious = function() {
        self.stop();
        previous();
        self.restart();
    };
    
    self.toNext = function() {
        self.stop();
        next();
        self.restart();
    };
    /*运行slide*/
    self.run = function(t) {
        if(!runOn)return null;
        var position=null;
        switch (direction) {
            case 'left'://向左滑动
                if(self.index<-(totalItemNum-viewItemNum-1)) {
                    self.index = viewItemNum;
                    t = self.index;
                }
                position = t*self.variation;
                moveOnce(position,direction,function() {
                        runTimeOutID = setTimeout(function() {self.run(--self.index);},delay);
                    }
                );
                break;
            case 'right'://向右滑动
                if(self.index>=totalItemNum-1) {
                    self.index =-1;
                    t = self.index;
                }
                position = t*self.variation;
                moveOnce(position,direction,function() {
                        runTimeOutID = setTimeout(function() {self.run(++self.index);},delay);
                    }
                );
                break;
        }
    };
    
    
    /*暂停动画后重新启动*/
    self.restart = function() {
        if(runOn)return true;
        runOn = 1;
        runtimeControlID = setTimeout(function() {self.run(self.index);},delay);
    };
    
    /*停止运行,不支持moveonce的停止*/
    self.stop = function() {
        if(!runOn)return true;
        runOn = 0;
        clearTimeout(runTimeOutID);
        clearTimeout(runtimeControlID);
    };
    
    /*初始化参数并开始slide*/
    self.init(options);
    setTimeout(function() {self.run(self.index);},delay);
    
};


/*
* 2013.4.10
*
* Slide插件    
* 
* 第二种思路解决方案:
*    将要滑动的模块
*    移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
*    此种思路适合广告位，一次展示一个frame
* 
*   如果浏览器支持css3则使用css3动画效果
*/

Ys.Slide = function(options) {
    
    if(typeof options != 'object')options = {};
     var self = this;
    
    var totalItem = options.totalItem;
    var itemWidth = options.itemWidth;
    var prefix = options.prefix||'slideItem';
    var duration = options.duration||300;
    var css3Duration=options.css3Duration||options.duration;
    var step = options.step||1;
    var stepTime = options.stepTime||1;
    var delay = options.delay||3000;
    var sliderID = options.sliderID||'slider';
    var slidingTimeoutID;
    var playingTimeoutID;
    var sliding = 0;
    var slider;
    var onShow = 0;
    var before;
    
    var controllerPrefix = options.controllerPrefix;
    var controllerOnClass = options.controllerOnClass;
    var sliderTranslate;
    var vendorTransform = Ys.vendorPrefix + "Transform";
    var vendorDuration = Ys.vendorPrefix + "TransitionDuration";
    var vendorTiming = Ys.vendorPrefix + "TransitionTimingFunction";
     
    self.slideBox = [];
    self.controllerBox = [];
    
    self.init = function() {
        for(var i = 0;i<totalItem;i++) {
            self.slideBox[i] = Ys('#'+prefix+i).element;
            self.slideBox[i].style.zIndex = 9;
            self.slideBox[i].style.position = 'absolute';
             self.controllerBox[i] = Ys('#'+controllerPrefix+i).element;
             if(i === 0){
                Ys(self.slideBox[i]).show();
                Ys.addClass(self.controllerBox[i],controllerOnClass);
            }
            else Ys(self.slideBox[i]).hide();
        }
        slider = Ys('#'+sliderID).element;
        slider.style.position ='absolute';
        if(!itemWidth)itemWidth = slider.offsetWidth;
    };
    
    var build = function(index,onShow,slideDirection) {
        switch(slideDirection) {
            case 'left':
                self.slideBox[index].style.left = itemWidth+'px';
                sliderTranslate = -itemWidth;
                break;
            case 'right':
                self.slideBox[index].style.left = -itemWidth+'px';
                sliderTranslate = itemWidth;
                break;
            default:
                if((index-onShow)<0) {
                    self.slideBox[index].style.left = -itemWidth+'px';
                    sliderTranslate = itemWidth;
                }else {
                    self.slideBox[index].style.left = itemWidth+'px';
                    sliderTranslate = -itemWidth;
                }
        }
        Ys(self.slideBox[index]).show();
        self.slideBox[onShow].style.zIndex = 9;
        self.slideBox[index].style.zIndex = 10;
    };
    
    var doMove = function(index,slideDirection,callback) {
        if(onShow ==index||sliding)return false;
        Ys.addClass(self.controllerBox[index],controllerOnClass);
        Ys.removeClass(self.controllerBox[onShow],controllerOnClass);
        sliding = 1;
        build(index,onShow,slideDirection);
        before = onShow;
        onShow = index;
        if(Ys.vendorPrefix) {
            /*浏览器支持css3的情况*/
            slider.style[vendorTransform]="translateX("+ sliderTranslate +"px)";
            slider.style[vendorTiming]="ease";
            slider.style[vendorDuration] = css3Duration+"ms";
            Ys.addEventListener(slider,Ys.vendorTransitionEnd,function end() {
                Ys(self.slideBox[before]).hide();
                self.slideBox[onShow].style.left = 0;
                slider.style[vendorTransform]="";
                slider.style[vendorTiming]="";
                slider.style[vendorDuration]="";
                slider.removeEventListener(Ys.vendorTransitionEnd,end);
                sliding = 0;
                if(typeof callback === 'function')callback();
            });
        }else {
            /*浏览器不支持css3的情况*/
            var startTimeTemp = 0;
            var tmpDuration = duration/8;
            var move = function(callbackTmp) {
                startTimeTemp+=stepTime;
                slider.style.left = Math.ceil(Ys.Tween.Quart.easeIn(startTimeTemp,0,sliderTranslate,tmpDuration))+'px';
                if(startTimeTemp<=tmpDuration) {
                    slidingTimeoutID = setTimeout(function() {move(callbackTmp);},stepTime);
                }else {
                    clearTimeout(slidingTimeoutID);
                    Ys(self.slideBox[before]).hide();
                    self.slideBox[onShow].style.left = 0;
                    slider.style.left = 0;
                    sliding = 0;
                    if(typeof callbackTmp === 'function')callbackTmp();
                }
            };
            if(typeof callback === 'function')move(callback);
            else move();
        }
        return true;
    };
    
    self.prev = function(callback) {
        self.stop();
        var index = onShow-1;
        if(index<0)index = totalItem-1;
        doMove(index,'right',function() {self.play();});
    };
    
    self.next = function(callback) {
        self.stop();
        var index = onShow+1;
        if(index>=totalItem)index = 0;
        doMove(index,'left',function() {self.play();});
    };
    
    self.goto = self.show = function(index) {
        self.stop();
        if(!doMove(index,'',function() {self.play();}))self.play();
    };
    
    self.play = function() {
        playingTimeoutID = setTimeout(function() {
            self.next();
            },delay);
    };
    
    self.stop = function() {
        return clearTimeout(playingTimeoutID);
    };
    
    self.init();
    
    self.play();
};


/*
* 2013.4.3
*
* Slide插件    
* 
* 第三种思路解决方案:
*    要移动的模块堆叠在一起,要展示用的z-index和display控制
*    效果为淡入淡出替换
*    此种思路适合广告位,单一模块展示
*
* 2013.6.25修改
* 加入css3的animation效果，优化支持css3的浏览器显示效果
*    
*/

Ys.fadeSlide = function(options) {
    
    if(typeof options != 'object')options = {};
    
    var self = this;
    
    var fadeinTimeoutID,fadeoutTimeoutID;
    var playTimeoutID;
    
    var totalItem = options.totalItem||5;
    var prefix = options.prefix||'slideItem';
    var startOpacity = options.startOpacity||0;
    var startPosition = options.startPosition||0;/*初始偏移位置*/
    var duration = options.duration||300;
    var css3Duration = options.css3Duration||options.duration||300;/*持续时间*/
    
    //var duration =(options.css3Duration)*0.1||30;/*持续时间*/
    var step = options.step||1;
    var stepTime = options.stepTime||1;
    var tween = options.tween||'Linear';/*tween算子*/
    var variation = 100;/*透明目的值*/
    var delay = options.delay||5000;/*两张切换的延迟*/
    var sliderID = options.sliderID;/**/
     /*controller*/
    var controllerPrefix = options.controllerPrefix || null;
    var controllerOnClass = options.controllerOnClass || null;
    
    var fadingInFlag = 0;
    var fadingOutFlag = 0;
    
    var preShown = 0;
    
    // var vendorAnimation = Ys.vendorPrefix + "AnimationName";
  //       var vendorDuration = Ys.vendorPrefix + "AnimationDuration";
  //       var vendorTiming = Ys.vendorPrefix + "AnimationTimingFunction";
    
    
    /*正在演示的index*/
    self.onShow = 0;
    
    /*滑动元素容器*/
    self.slideBox = [];
    self.controllerBox = [];
     self.init = function() {
        Ys('#'+sliderID).element.style.position = 'relative';
        for(var i = 0 ; i<totalItem ; i++) {
            self.slideBox[i] = Ys('#' + prefix + i).element;
            self.slideBox[i].style.position = 'absolute';
            self.slideBox[i].style.top = self.slideBox[i].style.left = 0;
             if(controllerPrefix !== null) {
                self.controllerBox[i] = Ys('#' + controllerPrefix + i).element;
                Ys('#' + controllerPrefix + i).bind("click",function(index){
                    return function() {
                        self.goto(index);
                    };
                }(i));
                /*$(controllerPrefix + i).bind("click",function(){
                    console.log(this);
                    
                });*/
            }
            if(i === 0) {
                Ys.addClass(self.controllerBox[i],controllerOnClass);
                Ys(self.slideBox[i]).show();
                self.slideBox[i].style.opacity = 1;
            }
            else {
                Ys(self.slideBox[i]).hide();
                self.slideBox[i].style.opacity = 0;
            }
        }
    };
    
    /*单次淡入淡出*/
    var doFade = function(index,time,startOpacity,direction,callback) {
        var opacityValue;
        var timetemp = time;
        opacityValue = Math.ceil(Ys.Tween.Linear(timetemp,startOpacity,variation,duration));
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="alpha(opacity ="+opacityValue+")";
            
        }else {
            self.slideBox[index].style.opacity = opacityValue/variation;
        }
        if(direction =='in') {
            timetemp+=step;
            if(Math.abs(timetemp)<=duration) {
                // if(Ys._IEVersion !== undefined && Ys._IEVersion<=8 && opacityValue>=100) {
                // clearTimeout(fadeinTimeoutID);
                // if(typeof callback =='function')callback();
                // }else {
                    fadeinTimeoutID = setTimeout(function() {doFade(index,timetemp,startOpacity,direction,callback);},stepTime);
                //}
            }
            else {
                clearTimeout(fadeinTimeoutID);
                if(typeof callback =='function')callback();
            }
        }
        if(direction =='out') {
            timetemp-=step;
            
            if(Math.abs(timetemp)<=duration) {
                // if(Ys._isIE&&opacityValue>=100) {
                // clearTimeout(fadeoutTimeoutID);
                // if(typeof callback =='function')callback();
                // }else {
                    fadeoutTimeoutID = setTimeout(function() {doFade(index,timetemp,startOpacity,direction,callback);},stepTime);
                // }
            }
            else {
                clearTimeout(fadeoutTimeoutID);
                if(typeof callback =='function')callback();
            }
        }
        
    };
    
    /*单次淡出效果*/
    self.fadeOut = function(index,callback) {
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="Alpha(opacity = 100)";
        } else {
            self.slideBox[index].style.opacity = 1;
        }
        Ys(self.slideBox[index]).show();
        doFade(index,0,variation,'out',function() {
            if(typeof callback =='function')callback();
        });
    };
    
    /*单次淡入效果*/
    self.fadeIn = function(index,callback) {
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="alpha(opacity = 0)";
        } else {
            self.slideBox[index].style.opacity = 0;
        }
        Ys(self.slideBox[index]).show();
        
        doFade(index,0,0,'in',function() {
            if(typeof callback =='function')callback();
        });
    };
    
    /*呈现标识符为index的元素*/
    self.show = function(index,callback) {
        if(self.onShow == index || fadingInFlag == 1 || fadingOutFlag==1)return false;
        fadingInFlag = 1;
        fadingOutFlag = 1;
        preShown = self.onShow;
        self.onShow = index;
        /*controller切换*/
        Ys.addClass(self.controllerBox[index],controllerOnClass);
        Ys.removeClass(self.controllerBox[preShown],controllerOnClass);
        /*if(Ys.vendorPrefix) {
        浏览器支持css3时渐变*/
            /*使用关键帧$(self.slideBox[index]).show();
            self.slideBox[index].style[vendorAnimation]="fadeIn";
            self.slideBox[preShown].style[vendorAnimation]="fadeOut";
            self.slideBox[index].style[vendorTiming] = self.slideBox[preShown].style[vendorTiming]="ease-out";
            self.slideBox[index].style[vendorDuration] = self.slideBox[preShown].style[vendorDuration] = css3Duration+"ms";
            self.slideBox[preShown].style.zIndex = 9;
            self.slideBox[index].style.zIndex = 10;
            Ys.addEventListener(self.slideBox[index],Ys.vendorAnimationEnd,function end() {
                self.slideBox[index].style.opacity = 1;
                self.slideBox[preShown].style.opacity = 0;
                Ys(self.slideBox[preShown]).hide();
                self.slideBox[index].style[vendorAnimation] = self.slideBox[preShown].style[vendorAnimation]="";
                self.slideBox[index].style[vendorTiming] = self.slideBox[preShown].style[vendorTiming]="";
                self.slideBox[index].style[vendorDuration] = self.slideBox[preShown].style[vendorDuration]="";
                self.slideBox[index].removeEventListener(Ys.vendorTransitionEnd,end);
                fadingInFlag = 0;
                if(typeof callback === 'function')callback();
            });
            
        } else {*/
            /*浏览器不支持css3时的渐变*/
            self.slideBox[preShown].style.zIndex = 9;
            self.slideBox[index].style.zIndex = 10;
            self.fadeIn(index,function() {
                Ys(self.slideBox[preShown]).hide();
                fadingInFlag = 0;
                if(typeof callback =='function')callback();
            });
             self.fadeOut(preShown,function() {
                Ys(self.slideBox[preShown]).hide();
                fadingOutFlag = 0;
                if(typeof callback =='function')callback();
            });
        /*}*/
    };
    
    self.previous = function(callback) {
        self.stop();
        if(self.onShow === 0)self.show(totalItem-1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
        else self.show(self.onShow-1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
    };
    
    self.next = function(callback) {
        self.stop();
        if(self.onShow ==(totalItem-1))self.show(0,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
        else self.show(self.onShow+1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
    };
     self.goto = function(index) {
        self.stop();
        self.show(index,self.play());
    };
    
    /*循环播放*/
    self.play = function() {
        if(playTimeoutID)clearTimeout(playTimeoutID);
        playTimeoutID = setTimeout(function() {
            self.next(function() { self.play();});
        },delay);
    };
    
    self.stop = function() {
        if(playTimeoutID)clearTimeout(playTimeoutID);
    };
    
    self.init();
    
    playTimeoutID = setTimeout(function() {
            self.next(function() { self.play();});
        },delay);
};

/*表单验证组件*/
Ys.formValidator = function(options) {
    
    if(typeof options != 'object')options = {};
    
    var self = this;
    
    self.regexEnum = {
        
        captcha:"^\\w{4}$",                                //四字母
        password:"^.{6,40}$",
        intege:"^-?[1-9]\\d*$",                    //整数
        intege1:"^[1-9]\\d*$",                    //正整数
        intege2:"^-[1-9]\\d*$",                    //负整数
        num:"^([+-]?)\\d*\\.?\\d+$",            //数字
        num1:"^[1-9]\\d*|0$",                    //正数（正整数 + 0）
        num2:"^-[1-9]\\d*|0$",                    //负数（负整数 + 0）
        decmal:"^([+-]?)\\d*\\.\\d+$",            //浮点数
        decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",　　    //正浮点数
        decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",　 //负浮点数
        decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",　 //浮点数
        decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",　　 //非负浮点数（正浮点数 + 0）
        decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",　　//非正浮点数（负浮点数 + 0）
        email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
        color:"^[a-fA-F0-9]{6}$",                //颜色
        url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",    //url
        chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",                    //仅中文
        ascii:"^[\\x00-\\xFF]+$",                //仅ACSII字符
        zipcode:"^\\d{6}$",                        //邮编
        mobile:"^(13|15)[0-9]{9}$",                //手机
        ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",    //ip地址
        notempty:"^\\S+$",                        //非空
        picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",    //图片
        rar:"(.*)\\.(rar|zip|7zip|tgz)$",                                //压缩文件
        qq:"^[1-9]*[1-9][0-9]*$",                //QQ号码
        tel:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",    //电话号码的函数(包括验证国内区号,国际区号,分机号)
        username:"^\\w+$",                        //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter:"^[A-Za-z]+$",                    //字母
        letter_u:"^[A-Z]+$",                    //大写字母
        letter_l:"^[a-z]+$",                    //小写字母
        idcard:"^[1-9]([0-9]{14}|[0-9]{17})$"    //身份证
    };
    
    options = {
        formId:options.formId||'form',
        asyncPost:options.asyncPost||'true',
        toVerifyItems:options.toVerifyItems,
        itemsWrap:options.itemsWrap||'',
        infoWrapIDs:options.infoWrapIDs||'',
        verifyType:options.verifyType,
        errorInfo:options.errorInfo||'',
        itemWrongFn:options.itemWrongFn||function(){},
        itemRightFn:options.itemRightFn||function(){},
        submit:options.submit||function(form){form.submit();},
        callbacks:options.callbacks
    };
    
    self.form = Ys('#' + options.formId).element;
    self.toVerifyItems = [];
    self.itemsWrap = [];
    self.infoWrap = [];
    self.validValue = [];
    self.callbacks = options.callbacks;
    function matchStr(regexEnum,str,rgExp) {
        if(!regexEnum[rgExp])return false;
        if(str.match(regexEnum[rgExp]) === null)return false;
        return true;
    }
    
    function checkOnce(index) {
        if(self.toVerifyItems[index].value !== '')Ys.addClass(self.itemsWrap[index],'notempty');
        else Ys.removeClass(self.itemsWrap[index],'notempty');
        if(!matchStr(self.regexEnum,self.toVerifyItems[index].value,options.verifyType[index])) {
            Ys.removeClass(self.itemsWrap[index],'right');
            Ys.addClass(self.itemsWrap[index],'wrong');
            Ys.addClass(self.infoWrap[index],'active');
            self.infoWrap[index].innerHTML = options.errorInfo[index];
            self.validValue[index] = false;
            options.itemWrongFn(index,self.toVerifyItems[index],self.infoWrap[index]);
            return false;
        }else {
            Ys.removeClass(self.itemsWrap[index],'wrong');
            Ys.addClass(self.itemsWrap[index],'right');
            self.infoWrap[index].innerHTML = '';
            Ys.removeClass(self.infoWrap[index],'active');
            self.validValue[index] = true;
            options.itemRightFn(index,self.toVerifyItems[index],self.infoWrap[index]);
            self.callbacks[index]();
            return true;
        }
    }
    
    
    
    self.init = function() {
        
        for(var j = 0;j<options.toVerifyItems.length;j++) {

            self.toVerifyItems[j] = Ys('#' + options.toVerifyItems[j]).element;
            if(!matchStr(self.regexEnum,self.toVerifyItems[j].value,options.verifyType[j])) {
                self.validValue[j] = false;
            }else {
                self.validValue[j] = true;
            }
            if(typeof(options.itemsWrap[j])=='undefined') {
                self.itemsWrap[j] = self.toVerifyItems[j].parentNode;
            }
            if(typeof(options.infoWrapIDs[j])!='undefined') {
                self.infoWrap[j] = Ys('#' + options.infoWrapIDs[j]).element;
            }
            Ys.addEventListener(self.toVerifyItems[j],'focus',function(j) {
                return function(){
                    Ys.addClass(self.itemsWrap[j],'focus');
                    Ys.addClass(self.toVerifyItems[j],'focus');
                };
            }(j));
             Ys.addEventListener(self.toVerifyItems[j],'blur',function(j) {
                return function(){
                    Ys.removeClass(self.itemsWrap[j],'focus');
                    Ys.removeClass(self.toVerifyItems[j],'focus');
                    checkOnce(j);
                };
            }(j));
        }
        
        
        Ys.addEventListener(self.form,'submit',function(e) {
            Ys.stopDefault(e);
            var ok = true;
            for(var i = 0;i<options.toVerifyItems.length;i++) {
                if(self.validValue[i] === false) {
                    if(!checkOnce(i)){
                        ok = false;
                    }
                }
            }
            if(ok === true){
                options.submit(self.form);
            } else {
                return false;
            }
        });
    };
    
    self.init();
    
};



/*
 *
 *
 *    拖拽组件
 *  粗糙实现
 *
 *    
*/
Ys.Drag = {
    obj: null,
    init: function (options) {
        options.handler.onmousedown = this.start;
        options.handler.root = options.root || options.handler;
        var root = options.handler.root;
        root.onDragStart = options.dragStart || new Function();
        root.onDrag = options.onDrag || new Function();
        root.onDragEnd = options.onDragEnd || new Function();
    },
    start: function (e) {
        /*此时的this是handler */
        var obj = Drag.obj = this;
        obj.style.cursor = 'move';
        e = e || Drag.fixEvent(window.event);
        ex = e.pageX;
        ey = e.pageY;
        obj.lastMouseX = ex;
        obj.lastMouseY = ey;
        var x = obj.root.offsetLeft;
        var y = obj.root.offsetTop;
        obj.root.style.left = x + "px";
        obj.root.style.top = y + "px";
        document.onmouseup = Drag.end;
        document.onmousemove = Drag.drag;
        obj.root.onDragStart(x, y);
    },
    drag: function (e) {
        e = e || Drag.fixEvent(window.event);
        ex = e.pageX;
        ey = e.pageY;
        var root = Drag.obj.root;
        var x = root.style.left ? parseInt(root.style.left) : 0;
        var y = root.style.top ? parseInt(root.style.top) : 0;
        var nx = ex - Drag.obj.lastMouseX + x;
        var ny = ey - Drag.obj.lastMouseY + y;
        root.style.left = nx + "px";
        root.style.top = ny + "px";
        Drag.obj.root.onDrag(nx, ny);
        Drag.obj.lastMouseX = ex;
        Drag.obj.lastMouseY = ey;
    },
    end: function (e) {
        var x = Drag.obj.root.style.left ? parseInt(Drag.obj.root.style.left) : 0;
        var y = Drag.obj.root.style.top ? parseInt(Drag.obj.root.style.top) : 0;
        Drag.obj.root.onDragEnd(x, y);
        document.onmousemove = null;
        document.onmouseup = null;
        Drag.obj = null;
    },
    fixEvent: function (e) {
        e.pageX = e.clientX + document.documentElement.scrollLeft;
        e.pageY = e.clientY + document.documentElement.scrollTop;
        return e;
    }
};

Ys.showOverlay = function() {
    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.insertBefore(overlay,document.body.firstChild);
};

Ys.collect = function(prefix,url) {
    
    var params = [];

    params[0]= document.URL || '';
    var args ='p ='+prefix;

    var c = new Ys.ajax( {
        url:url+args,
        type:'GET'
    });
};
Ys.loadJs = function(url) {
    var i;
    var ss = document.getElementsByTagName("script");
    for (i = 0; i < ss.length; i++) {
        if (ss[i].src && ss[i].src.indexOf(url) != -1) {
            return;
        }
    }
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = url;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(s);
};

/*网站配及=置及用户信息*/
Ys.config = {};

