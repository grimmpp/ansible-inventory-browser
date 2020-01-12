
var scrollableTable = function(id, wrapperId) {

    var root = this
    var lastSelectedRow = ""
    var lastRowId = -1
    var isTreeTable = false
    var autoExpandOrCollapse = false

    var create = function() {
        $('<section>').addClass("scrollableTableSection").append(
            $('<div>').attr('id', id+'_scrollableTableContainer').addClass("scrollableTableContainer").append(
                $('<table>').attr('id', id).addClass("scrollableTable").append(
                    $('<thead>').attr("id", "scrollableTableHeader"), $('<tbody>') )
        )).prependTo('#'+wrapperId);

        $(document).keydown(function(e) { 
            if (e.key === "ArrowUp") {
                selectPreviousRow()
                if (!(isSelectedRowCloseToTop())) e.view.event.preventDefault()
            }
            else if (e.key === "ArrowDown") {
                selectNextRow()
                if (!(isSelectedRowCloseToBottom())) e.view.event.preventDefault()
            }
            else if (e.key === "ArrowRight") openCurrentRow()
            else if (e.key === "ArrowLeft") closeCurrentRow()
        })
    }

    var isSelectedRowCloseToTop = function() {
        if (lastSelectedRow != '') {
            if (($('#'+lastSelectedRow).offset().top - $('#'+id+'_scrollableTableContainer').offset().top) < 50) return true
        }
        return false
    }

    var isSelectedRowCloseToBottom = function() {
        if (lastSelectedRow != '') {
            var height = $('#'+id+'_scrollableTableContainer').height()
            if ((height - $('#'+lastSelectedRow).offset().top) < 50) return true
        }
        return false
    }

    this.setTableHeight = function(height) {
        if ($.isFunction(height)) {
            $('#'+id+'_scrollableTableContainer').height( height() )

            // add listener for window resize events
            $( window ).resize(function() {
                $('.scrollableTableContainer').height( height )
            })
        } else {
            $('#'+id+'_scrollableTableContainer').height( height )
        }
    }

    var getNestedProperty = function(obj, propArray) {
        try {
            var _obj = obj
            propArray.forEach(prop => {
                _obj = _obj[prop]
            });
            return _obj
        } catch (e) {
            return "NO VALUE!"
        }
    }

    
    this.selectRow = function(rowId, triggerEventName, itemName) {
        if (lastSelectedRow != "") {
            $('#'+lastSelectedRow).children().removeClass("scrollableTableSelectedRow")
        }
        
        if (lastSelectedRow == rowId) {
            lastSelectedRow = ""

            $( document ).trigger( triggerEventName, [ "" ] )
        } else {
            $("#"+rowId).children().addClass("scrollableTableSelectedRow")
            lastSelectedRow = rowId

            $( document ).trigger( triggerEventName, [ itemName ] )
        }
    }

    this.selectTreeTableRow = function(rowId, triggerEventName, nestedIndex) {
        if (!(autoExpandOrCollapse)) {
            if (lastSelectedRow != rowId) {
                if (lastSelectedRow != "") {
                    $('#'+lastSelectedRow).children().removeClass("scrollableTableSelectedRow")
                }

                $("#"+rowId).children().addClass("scrollableTableSelectedRow")
                lastSelectedRow = rowId

                $( document ).trigger( triggerEventName, [ nestedIndex ] )
            }
        }
    }

    
    var selectPreviousRow = function() {
        if (lastSelectedRow != "" && !($('#'+lastSelectedRow).is(':first-child'))) {
            $('#'+lastSelectedRow).prev().click()
        }
    }

    var selectNextRow = function() {
        if (lastSelectedRow != "" && !($('#'+lastSelectedRow).is(':last-child'))) {
            $('#'+lastSelectedRow).next().click()
        }
    }

    this.collapseTree = function() {
        autoExpandOrCollapse = true
        while ($( "tr[status='open']" ).length > 0) {
            $( "tr[status='closed']" ).each(function(index, elem) {
                elem.click()
            })
        }
        autoExpandOrCollapse = false
    }

    var openCurrentRow = function(){
        var parentId = null
        if (lastSelectedRow != "") {
            autoExpandOrCollapse = true
            var currentRow = $('#'+lastSelectedRow)
            if (currentRow.attr('status') == 'closed') {
                currentRow.click()
            } else if(currentRow.attr('level') > 1) {
                parentId = currentRow.attr('parentid')
                if ($('#'+parentId).attr('status') == 'closed') {
                    $('#'+parentId).click()
                }
            }
            autoExpandOrCollapse = false
            if (parentId != null) $('#'+parentId).click()
        }
    }

    var closeCurrentRow = function(){
        var parentId = null
        if (lastSelectedRow != "") {
            autoExpandOrCollapse = true
            var currentRow = $('#'+lastSelectedRow)
            if (currentRow.attr('status') == 'open') {
                currentRow.click()
            } else if(currentRow.attr('level') > 1) {
                parentId = currentRow.attr('parentid')
                if ($('#'+parentId).attr('status') == 'open') {
                    $('#'+parentId).click()
                }
            }
            autoExpandOrCollapse = false
            if (parentId != null) $('#'+parentId).click()
        }
    }

    this.expandTree = function() {
        autoExpandOrCollapse = true
        while ($( "tr[status='closed']" ).length > 0) {
            $( "tr[status='closed']" ).each(function(index, elem) {
                elem.click()
            })
        }
        autoExpandOrCollapse = false
    }

    this.setTableHeader = function(names) {
        // clear first
        $('#'+id+' > thead').empty()

        var trElem = $('<tr>');
        $.each(names, function(index, value) {
            // Set header
            trElem.append( 
                $('<th>')
                    .append($('<div>').text(value))
                    .click(() => {root.sortByColumnIndex(index)})
            )
        });
        trElem.appendTo("#scrollableTableHeader")
    }

    this.adjustHeaderSize = function() {
        //  set size to 0
        $('#'+id+' > thead > tr').children('th').each(function () {
            var divElem = $(this).children().first()
            $(this).append( $('<span>').text(divElem.text()) )
            divElem.width( 0 )
        })

        // Adjust size
        $('#'+id+' > thead > tr').children('th').each(function () {
            var div = $(this).children().first()
            div.width( $(this).width() )
            div.css('background-position-x', $(this).width()-15)
            $(this).width( $(this).width() )
        })
        // remove text from th
        $('#'+id+' > thead > tr > th').children('span').remove()

        $('#scrollableTableHeader > tr > th > div').addClass('scrollableTableHeaderBackground')
    }

    this.setTableContent = function(data, eventType, columns, subtreePropertyName="") {
        if (subtreePropertyName === undefined) subtreePropertyName = ""
        isTreeTable = subtreePropertyName != ""
        fillTable(data, eventType, columns, subtreePropertyName)

        root.adjustHeaderSize()
    }

    var fillTable = function(data, eventType, columns, subtreePropertyName="") {
        $('#'+id+' > tbody').empty()
        lastSelectedRow = ""
        
        var insertAfterElem = null
        var parentId = "scrollableTable_rowId_root"
        var level = 1

        // Fill content
        $.each(data, function(index) {
            createChildRow(data, index, eventType, columns, subtreePropertyName, insertAfterElem, parentId, level, [index]);
        })
    }

    var createChildRow = function(data, index, eventType, columns, subtreePropertyName, insertAfterElem, parentId, level, parentIndexes) {
        // build row id
        const rowId = id+'_rowId_'+ (++lastRowId)

        // create html row
        var trElem = $('<tr>').attr('id', rowId).attr('level', level).attr('parentId', parentId)

        if (isTreeTable) trElem.click(() => { root.selectTreeTableRow(rowId, eventType, parentIndexes) })
        else trElem.click(() => { root.selectRow(rowId, eventType, index) })

        // calc distance for collapse and expand icon
        const distText = level*16
        const distIcon=(level-1)*16

        // fill up cells
        $.each(columns, function(c_index, c_value) {
            trElem.append($('<td>').text(data[index][c_value]))
        })

        // isTreeTable
        if (isTreeTable) {
            trElem.children().first().attr('style', 'padding-left: '+distText+'px; ')

            // if element has subtree
            if (data[index][subtreePropertyName] !== undefined && data[index][subtreePropertyName].length > 0 ) {
                const fristTdElem = trElem.children().first();
                
                // fristTdElem.removeClass("scrollableTableExpanded")
                fristTdElem.addClass("scrollableTableCollapsed")
                fristTdElem.attr('style', 'padding-left: '+distText+'px; background-position-x: '+distIcon+'px; ')
                trElem.attr('status', 'closed')

                trElem.click(function(event) {
                    var cursorPos = event.clientX - fristTdElem.offset().left - distIcon
                    var clickedOnIcon = (cursorPos < 16 && cursorPos >= 0)

                    const subtreeData = data[index][subtreePropertyName]
                    // const _rowId = rowId
                    // const _level = level+1

                    if (clickedOnIcon || autoExpandOrCollapse) {
                        if ($('#'+rowId).attr('status') == 'closed') {
                            $('#'+rowId).attr('status', 'open')
                            // Fill content
                            for (var i=subtreeData.length-1; i>=0; i--) {
                                var _indexes = []
                                parentIndexes.forEach(function(_i){ _indexes.push(_i)})
                                _indexes.push(i)
                                createChildRow(subtreeData, i, eventType, columns, subtreePropertyName, trElem, rowId, level+1, _indexes)
                            }
                            fristTdElem.addClass("scrollableTableExpanded")
                            fristTdElem.removeClass("scrollableTableCollapsed")

                            //if table is sorted sort newly expanded subtree
                            var sortInfo = root.getSortInfo()
                            if (sortInfo.isSorted) {
                                sortSubtreeByColumn(rowId, sortInfo.columnIndex, sortInfo.sortDir)
                            }

                        } else {
                            closeSubRows(rowId)
                            fristTdElem.removeClass("scrollableTableExpanded")
                            fristTdElem.addClass("scrollableTableCollapsed")
                        }
                    }

                    root.adjustHeaderSize() 
                })
            }
        }
        
        if (insertAfterElem == null) {
            trElem.appendTo('#'+id)
        } else {
            trElem.insertAfter(insertAfterElem)
        }
    }

    var closeSubRows = function(parentRowId) {
        $('#'+parentRowId).attr('status', 'closed')
        
        $( "tr[parentId='"+parentRowId+"']" ).each(function(index, elem) {
            var parentTr = $( document ).find( elem )
            // if (parentTr.attr('status') == 'open') closeSubRows(parentTr.attr('id'))
            if (parentTr.attr('status') == 'open') closeSubRows(parentTr.attr('id'))
            parentTr.remove()
        })

        // $( "tr[parentId='"+parentRowId+"']" ).remove()
    }

    this.clearTable = function() {
        lastSelectedRow = ""
        $('#scrollableTable > thead').empty()
        $('#scrollableTable > tbody').empty()
    }

    var getRowId = function(row){
        return row.attr('id')
    }

    var getCellValueFromTable = function(row, column) {
        return row.children().eq(column).text()
    }

    /**
     *      SORT FUNCTIONS
     */

    this.sortByColumnName = function(columnName) {
        var columnButton = $('#scrollableTable > thead > tr > th:contains("'+columnName+'")')
        var index = columnButton.parent().children().index(columnButton)
        root.sortByColumnIndex(index)
    }

    this.sortByColumnIndex = function(columnIndex) {
        var columnButton = $('#'+id+' > thead > tr > th').eq(columnIndex)
        
        var parentId = $('tr[level=1]', $('#scrollableTable > tbody')).first().attr('parentId')

        // swop sort directions
        var sortDir = columnButton.attr('sortDir')
        $('#scrollableTable > thead > tr > th').removeAttr('sortDir');
        if (sortDir === undefined) sortDir = 1
        else sortDir = sortDir * -1
        columnButton.attr('sortDir', sortDir)
        
        // reset and set sort icons
        $('#scrollableTable > thead > tr > th > div').css('background-image', "url('css/unsorted-icon.png')")
        if (sortDir == -1) columnButton.children('div').css('background-image', "url('css/dasc-icon.png')")
        else columnButton.children('div').css('background-image', "url('css/asc-icon.png')")

        console.log("sort by column (Name: %s, Index: %d, direction: %d)", columnButton.text(), columnIndex, sortDir)
        sortSubtreeByColumn(parentId, columnIndex, sortDir)

        // remove all flags
        $('#scrollableTable > tbody > tr').removeAttr('subtreeSorted');
        // console.log("sorting finished")
    }

    this.getSortInfo = function() {
        var columnButton = $('#scrollableTable > thead > tr > th[sortDir]')
        var index = columnButton.parent().children().index(columnButton)

        return {
            isSorted: index > -1, 
            buttonObject: columnButton,
            buttonText: columnButton.text(),
            columnIndex: index,
            sortDir: columnButton.attr('sortDir')
        }
    }

    var defaultCompareFunction = function(a,b) {
        return a.localeCompare(b, undefined, {usage: 'sort', numeric: true, sensitivity: 'base'})
    }

    var compareFunction = defaultCompareFunction

    this.setCompareFunctionForSorting = function(f) {
        compareFunction = f
    }

    var sortSubtreeByColumn = function(parentId, columnIndex, sortDir) {
        // bubbleSort(Array A)
        //     for (n=A.size; n>1; --n){
        //         for (i=0; i<n-1; ++i){
        //         if (A[i] > A[i+1]){
        //             A.swap(i, i+1)
        //         } // End if
        //         } // End inner for-loop
        //     } // End second for-loop
        
        // console.log("sortSubtreeByColumn - parentId: %s, columnIndex: %d, sortDir: %d", parentId, columnIndex, sortDir)
        
        var size = $('tr[parentId='+parentId+']', $('#scrollableTable > tbody')).length
        for(var n=size; n>1; n--) {
            
            var row1 = $('tr[parentId='+parentId+']', $('#scrollableTable > tbody')).first()
            handleSubtree(row1, columnIndex, sortDir)

            // sort list which have entered given parentId
            do {
                var value1 = getCellValueFromTable(row1, columnIndex)
                var row2 = findNextTableRowOnSameLevel(row1)
                // if there is no second element in the same subtree
                if (row2 === undefined) break;
                var value2 = getCellValueFromTable(row2, columnIndex)

                handleSubtree(row2, columnIndex, sortDir)

                // console.log("row1 id: "+getRowId(row1)+", value1: "+value1)   
                // console.log("row2 id: "+getRowId(row2)+", value1: "+value2)   
                // console.log("")

                // console.log("compare: "+firstValue.localeCompare(secondValue))

                if (compareFunction(value1, value2) == sortDir) {
                    // move first element after second
                    moveRowAfter(row1, row2)
                }
                else {
                    row1 = row2
                }
                
            } while(getRowId(row1) != undefined && getRowId(row2) != undefined )
            // console.log("############################################")
        }
    }

    var handleSubtree = function(row, columnIndex, sortDir) {
        if (hasRowSubtree(row) && subtreeIsNotSorted(row)) {
            row.attr('subtreeSorted', 'true')
            // console.log("subtree "+getValueFromTable(row,columnIndex))
            sortSubtreeByColumn(row.attr('id'), columnIndex, sortDir)
        }
    }

    var hasRowSubtree = function(row) {
        return row.next().attr('level') > row.attr('level')
    }

    var subtreeIsNotSorted = function(row) {
        return !(row.attr('subtreeSorted') == 'true')
    }

    var moveRowAfter = function(row1, row2) {
        // console.log("\nmoveRowAfter - start")

        var lastChildRow2 = findLastChildRow(row2)
        // console.log("move - down - row1: "+getValueFromTable(row1,0))
        // console.log("move down - row2: "+getValueFromTable(row2,0))
        // console.log("move down - last child row2: "+getValueFromTable(lastChildRow2,0))
        
        // start with last subtree element of row1
        do {
            var currentRow = row2.prev()
            currentRow.insertAfter(lastChildRow2)

            // console.log("move down - move " + getValueFromTable(currentRow,0) + " after " + getValueFromTable(lastChildRow2,0))
            // console.log("move down - current row Id: " + getRowId(currentRow) +", row1 Id: "+getRowId(row1))
        } while(getRowId(currentRow) != getRowId(row1))
    }

    var findLastChildRow = function(row) {
        var lastChild = row

        // console.log("findLastChildRow - row "+getValueFromTable(row,0) +", level: "+row.attr('level'))
        // console.log("findLastChildRow - next: "+ getValueFromTable(lastChild.next(), 0))

        while (row.attr('level') < lastChild.next().attr('level')) {
            // console.log("findLastChildRow - child "+getValueFromTable(lastChild,0) +", level: "+lastChild.attr('level'))
            lastChild = lastChild.next()
        }
        // console.log("findLastChildRow - last child "+getValueFromTable(lastChild,0) +", level: "+lastChild.attr('level'))
        
        return lastChild
    }

    var findNextTableRowOnSameLevel = function(row) {
        var level = row.attr('level')
        var parentId = row.attr('parentid')
        var nextElem = row
        var nextLevel = 0

        do {
            nextElem = nextElem.next()
            nextLevel = nextElem.attr('level')
            nextParentId = nextElem.attr('parentid')
        } while (level < nextLevel && parentId != nextParentId)

        // if first element does not match
        if (parentId != nextElem.attr('parentid')) return undefined

        return nextElem
    }

    /**
     *      END SORT FUNCTIONS
     */

    
    /**
     *      FILTER FUNCTIONS
     */


    this.clearFilter = function() {
        filter("")
    }


    var containsRowSearchString = function(row, searchString) {
        var result = false

        row.children('td').each((index, _td) => {
            var tdElem = $(_td)
            if (tdElem.text().toLowerCase().indexOf(searchString) > -1) {
                result = true
                return
            }
        })

        return result
    }

    var makeParentsVisible = function(parentId) {
        if (parentId.indexOf('root') == -1) {
            $('#'+parentId).css('display', '')
            makeParentsVisible($('#'+parentId).attr('parentId'))
        }
    }

    this.filter = function(searchString) {
        var rows = $('#scrollableTable > tbody > tr')

        rows.each((index, _row) => {
            var row = $(_row)
            if (!containsRowSearchString(row, searchString.toLowerCase())) {
                row.css('display', 'none')
            } else {
                row.css('display', '')
                makeParentsVisible($(row).attr('parentId'))
            }
        })
    }

    /**
     *      END FILTER FUNCTIONS
     */
    

    create()
}
