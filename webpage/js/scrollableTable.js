
var scrollableTable = function(id, wrapperId, enableLogging=false) {

    var logging = enableLogging
    var root = this
    var lastRowId = 0
    var metadata = {}


    this.enableLogging = function(enabled = true) {
        logging = enabled
    }

    /** ###########    Metadata Functions    ########### */


    var resetMetadata = function(data = {}, columnNames = "", eventType = "", subtreePropertyName="") {
        metadata = {
            data: JSON.parse( JSON.stringify(data) ),
            rowInfo: [],
            eventType: eventType,
            columnNames: columnNames,
            subtreePropertyName: subtreePropertyName,
            filter: [],
            selectedRows: []
        }
    }

    var initiallyPrepareMetaData = function(data, metadataRowInfo, parentId, level, nestedIds) {

        $.each(data, function(index) {

            var rowId = id+'_rowId_'+ (++lastRowId)
            var parentRowId = id+'_rowId_'+parentId

            var _ids = []
            nestedIds.forEach((_i) => _ids.push(_i))
            _ids.push(lastRowId)

            rowInfo = {
                rowId: rowId,
                id: lastRowId,
                parentId: parentId,
                parentRowId: parentRowId,
                level: level,
                displayed: true,
                nestedIds: _ids,
                expanded: false,
                isSelected: false,
                dataEntry: data[index],
                rowInfoSubtree: [],
                tableRow: null
            }
            metadataRowInfo.push(rowInfo)

            if (metadata.subtreePropertyName.length > 0 &&
                data[index][metadata.subtreePropertyName] !== undefined) {

                var dataSubtree = data[index][metadata.subtreePropertyName]
                var rowInfoSubtree = rowInfo.rowInfoSubtree
                
                initiallyPrepareMetaData(dataSubtree, rowInfoSubtree, lastRowId, level+1, _ids)
            }
        })
    }


    /** ###########    END Metadata Functions    ########### */




    /** ###########    HTML Widget Functions    ########### */

    var createHtmlWidget = function() {
        resetMetadata()

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

    /** ###########    END HTML Widget Functions    ########### */




    /** ###########    SCROLL FUNCTIONS    ########### */

    var isSelectedRowCloseToTop = function() {
        
        if( metadata.selectedRows.length == 1) {
            var rowId = metadata.selectedRows[0].rowId
            if (($('#'+rowId).offset().top - $('#'+id+'_scrollableTableContainer').offset().top) < 50) return true
        }

        return false
    }

    var isSelectedRowCloseToBottom = function() {
        
        if( metadata.selectedRows.length == 1) {
            var rowId = metadata.selectedRows[0].rowId
            var height = $('#'+id+'_scrollableTableContainer').height()
            if ((height - $('#'+rowId).offset().top) < 50) return true
        }

        return false
    }

    /** ###########    END SCROLL FUNCTIONS    ########### */




    /** ###########    SELECTION OF ROWS    ########### */

    var clearAllSelectedRows = function() {
        metadata.selectedRows.forEach( (rowInfo) => {
            rowInfo.isSelected = false
            showRowSelection(rowInfo)
        })

        metadata.selectedRows = []
    }

    var chickHandlerForSelectRow = function(rowInfo) {
        
        var isSelected = rowInfo.isSelected

        clearAllSelectedRows()

        rowInfo.isSelected = !isSelected

        if (rowInfo.isSelected) metadata.selectedRows.push(rowInfo)
        
        showRowSelection(rowInfo)

        if (rowInfo.isSelected) $(document).trigger( metadata.eventType, {rowId: rowInfo.rowId, data: rowInfo.dataEntry} )
        else $(document).trigger( metadata.eventType, null )

        if (logging) console.log("Selected Row id: "+rowInfo.rowId)
    }

    var showRowSelection = function(rowInfo) {
        if (rowInfo.isSelected) {
            $('#'+rowInfo.rowId).addClass("scrollableTableSelectedRow")
        }
        else {
            $('#'+rowInfo.rowId).removeClass("scrollableTableSelectedRow")
        }
    }
    
    var selectPreviousRow = function() {
        
        // if (metadata.selectedRows.length == 1) {
            var rowInfo = metadata.selectedRows[0]
            var firstRow = $('#scrollableTable > tbody > tr:first')

            if (rowInfo.rowId != firstRow.attr('id')) {
                var prevTR = $('#'+rowInfo.rowId).prev()
                
                clearAllSelectedRows()

                // click on row
                prevTR.click()
            }
        // }
    }

    var selectNextRow = function() {
        var rowInfo = metadata.selectedRows[0]
        var lastRow = $('#scrollableTable > tbody > tr:last')

        if (rowInfo.rowId != lastRow.attr('id')) {
            var nextTR = $('#'+rowInfo.rowId).next()

            clearAllSelectedRows()

            // click on row
            nextTR.click()
        }
    }

    /** ###########    END SELECTION OF ROWS    ########### */




    /** ###########    Collapse and Expand Functions    ########### */

    this.collapseTree = function() {

        metadata.rowInfo.forEach( (rowInfo) => {

            if (rowInfo.rowInfoSubtree.length > 0 && rowInfo.expanded) {
                collapseSubtree(rowInfo.rowInfoSubtree)
            }
        })
    }

    var expandAllSubtrees = function(rowInfoArray) {
        
        rowInfoArray.forEach( (rowInfo) => {

            if (rowInfo.rowInfoSubtree.length > 0 && !rowInfo.expanded) {
                rowInfo.expanded = true
                createSubtree(rowInfo.rowInfoSubtree, rowInfo.tableRow)
                expandAllSubtrees(rowInfo.rowInfoSubtree)
                
                // refresh existing parent node
                showTreeIcon(rowInfo)
            }
        })
    }

    this.expandTree = function() {
        if (logging) console.log("expandTree")
        expandAllSubtrees(metadata.rowInfo)
    }

    /** ###########    End Collapse and Expand Functions    ########### */



    /** ###########    CREATE TABLE FUNCTIONS    ########### */

    this.setTableHeader = function(names) {
        // clear first
        $('#'+id+' > thead').empty()

        // create headlines
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

    /**
     * let the browser calculate the width of the columns and then set this width to the div containers
     * 
     * This function needs to be called after changing content of the table in order to adjust the header columns width
     */
    var adjustHeaderSize = function() {
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
        // this is only needed so that the browser can calculate the original width
        $('#'+id+' > thead > tr > th').children('span').remove()

        $('#scrollableTableHeader > tr > th > div').addClass('scrollableTableHeaderBackground')
    }

    this.setTableContent = function(data, eventType, columnNames, subtreePropertyName="") {
        if (subtreePropertyName === undefined) subtreePropertyName = ""
        isTreeTable = subtreePropertyName != ""

        resetMetadata(data, columnNames, eventType, subtreePropertyName)

        initiallyPrepareMetaData(metadata.data, metadata.rowInfo, 0, 1, [])

        root.refreshTableContent()
    }

    this.refreshTableContent = function() {
        $('#scrollableTable > tbody').empty()
        createSubtree(metadata.rowInfo)

        adjustHeaderSize()
    }

    /**
     * creates the TR elements in the table, sets the style and adds all handlers
     * @param {*} rowInfoArray list of meta info about the subtree elements as list
     * @param {*} lastEnteredTR last TR element after which all new elements will be entered
     */
    var createSubtree = function(rowInfoArray, lastEnteredTR=null) {

        rowInfoArray.forEach((rowInfo) => {

            // Create TR
            rowInfo.tableRow = $('<tr>')
            
            // add attributes
            rowInfo.tableRow.attr('id', rowInfo.rowId)
            rowInfo.tableRow.attr('level', rowInfo.level)
            rowInfo.tableRow.attr('parentId', rowInfo.parentRowId)
            rowInfo.tableRow.attr('findStr', rowInfo.dataEntry.inventory+';'+rowInfo.dataEntry.type+';'+rowInfo.dataEntry.name)

            setTableRowVisibility(rowInfo)

            // Create TDs (Columns)
            // fill up cells
            metadata.columnNames.forEach( (cName) => {
                rowInfo.tableRow.append( $('<td>').text( rowInfo.dataEntry[cName] ))
            })

            // define click handler for selection
            rowInfo.tableRow.click(() => { chickHandlerForSelectRow(rowInfo) })
            
            // define click handler for expand / collapse tree
            rowInfo.tableRow.click((event) => { clickHandlerForExpandAndCollapse(rowInfo, event) })

            if (lastEnteredTR == null) rowInfo.tableRow.appendTo('#'+id)
            else rowInfo.tableRow.insertAfter(lastEnteredTR)

            showTreeIcon(rowInfo)

            // display selected rows 
            // needs to be placed after attaching the TR element
            showRowSelection(rowInfo)

            lastEnteredTR = rowInfo.tableRow

            // enter subtree
            if (rowInfo.rowInfoSubtree.length > 0 && rowInfo.expanded) {
                lastEnteredTR = createSubtree(rowInfo.rowInfoSubtree, lastEnteredTR)
            }
        })

        return lastEnteredTR
    }

    var setTableRowVisibility = function(rowInfo) {
        if (rowInfo.displayed) rowInfo.tableRow.css('display', '')
        else rowInfo.tableRow.css('display', 'none')
    }

    /**
     * Click handler which is called for expanding and collapsing a subtree
     * @param {*} rowInfo 
     * @param {*} event 
     */
    var clickHandlerForExpandAndCollapse = function(rowInfo, event) {
        const distIcon = (rowInfo.level-1)*16

        var firstTD = rowInfo.tableRow.children().first()
        var cursorPos = event.clientX - firstTD.offset().left - distIcon
        var clickedOnIcon = (cursorPos < 16 && cursorPos >= 0)

        if (clickedOnIcon) {

            if (logging) console.log("Clicked on expand/collapse icon, id: "+rowInfo.rowId)
            if (rowInfo.expanded) {
                // collapse subtree
                collapseSubtree(rowInfo.rowInfoSubtree)
            } else {
                // expand subtree
                createSubtree(rowInfo.rowInfoSubtree, rowInfo.tableRow)
            }
            // store meta info about row
            rowInfo.expanded = !rowInfo.expanded

            showTreeIcon(rowInfo)
        }
    }

    /**
     * closes a subtree after clicking on the icon
     * @param {*} rowInfoArray 
     */
    var collapseSubtree = function(rowInfoArray) {
        rowInfoArray.forEach((rowInfo) => {

            // start collapsing from bottom to top
            if (rowInfo.rowInfoSubtree.length > 0) {
                collapseSubtree(rowInfo.rowInfoSubtree)
                rowInfo.expanded = false
            }

            $('#'+rowInfo.rowId).remove()
        })
    }

    var showTreeIcon = function(rowInfo) {
        // calc distance for collapse and expand icon
        const distText = rowInfo.level*16
        const distIcon = (rowInfo.level-1)*16

        var firstTD = rowInfo.tableRow.children().first()
        firstTD.attr('style', 'padding-left: '+distText+'px; ')

        if (rowInfo.rowInfoSubtree.length > 0) {
            firstTD.css('padding-left', distText)
            firstTD.css('background-position-x', distIcon)
            if (rowInfo.expanded) {
                firstTD.removeClass("scrollableTableCollapsed")
                firstTD.addClass("scrollableTableExpanded")
            }
            else {
                firstTD.removeClass("scrollableTableExpanded")
                firstTD.addClass("scrollableTableCollapsed")
            }
        }
    }


    this.clearTableContent = function() {
        lastSelectedRow = ""
        resetMetadata()

        $('#scrollableTable > thead').empty()
        $('#scrollableTable > tbody').empty()
    }

    /** ###########    END CREATE TABLE FUNCTIONS    ########### */


    var getCellValueFromTable = function(row, column) {
        return row.children().eq(column).text()
    }

 
 
 
    /** ###########    SORT FUNCTIONS    ########### */

    this.sortByColumnName = function(columnName) {
        var columnButton = $('#scrollableTable > thead > tr > th:contains("'+columnName+'")')
        var index = columnButton.parent().children().index(columnButton)

        // error message
        if (index == -1) {
            var validNames = []
            $('#scrollableTable > thead > tr > th > div').each((i, div) => validNames.push(div.innerText))
            console.log("'%s' is no valid column name. Valid names are: %s", columnName, JSON.stringify(validNames))
        }

        root.sortByColumnIndex(index)
    }

    this.sortByColumnIndex = function(columnIndex) {
        var startMilli = performance.now()

        var columnButton = $('#'+id+' > thead > tr > th').eq(columnIndex)

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

        if (logging) console.log("sort by column (Name: %s, Index: %d, direction: %d)", columnButton.text(), columnIndex, sortDir)
        // actual sort function
        sortSubtreeByColumn(metadata.rowInfo, metadata.columnNames[columnIndex], sortDir)

        // remove all flags
        $('#scrollableTable > tbody > tr').removeAttr('subtreeSorted');
        root.refreshTableContent()

        if (logging) console.log("Sorting and redrawing the table took %d milli seconds.", (performance.now() - startMilli))
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

    var sortSubtreeByColumn = function(rowInfoArray, columnName, sortDir) {
        rowInfoArray.sort( function(a,b) {
            if (a.rowInfoSubtree.length > 0) {
                sortSubtreeByColumn(a.rowInfoSubtree, columnName, sortDir)
            }
            return compareFunction(a.dataEntry[columnName].toString(), b.dataEntry[columnName]) * sortDir
        })
        root.refreshTableContent()
    }


    /** ###########    END SORT FUNCTIONS    ########### */

    


     /** ###########    FILTER FUNCTIONS    ########### */

    this.clearFilter = function() {
        filter("")
    }

    this.filter = function(searchString) {
        var startMilli = performance.now()
        if (logging) console.log("Filter table: %s", JSON.stringify(searchString) )

        metadata.filter = searchString.split(' ').filter(Boolean) // remove empty strings
        filterMetadata(metadata.rowInfo)

        if (logging) console.log("Filtering and redrawing the table took %d milli seconds.", (performance.now() - startMilli))
    }

    /**
     * sets visibility in metadata and updates UI
     * @param {*} rowInfoArray 
     * @returns if a child node is visible
     */
    var filterMetadata = function(rowInfoArray) {
        var anyVisible = false

        rowInfoArray.forEach( (rowInfo) => {
            // check if search strings are contained
            rowInfo.displayed = containsRowSearchString(rowInfo)

            // if node in subtree is visible then make parent visible as well
            if (rowInfo.rowInfoSubtree.length > 0)  rowInfo.displayed |= filterMetadata(rowInfo.rowInfoSubtree)

            // check if one node is visible to return info for parent node
            anyVisible |= rowInfo.displayed

            // change visibility
            setTableRowVisibility(rowInfo)         
        })

        return anyVisible
    }

    var containsRowSearchString = function(rowInfo) {

        for(var cIndex in metadata.columnNames) {
            var cName = metadata.columnNames[cIndex]
            
            if (rowInfo.dataEntry[cName] !== undefined) {
                var text = rowInfo.dataEntry[cName].toString().toLowerCase()

                if (metadata.filter.length == 0) return true
                for(var sIndex in metadata.filter) {
                    var sStr = metadata.filter[sIndex]
                    if (text.indexOf(sStr) > -1) return true
                }
            }
        }

        return false
    }

    /** ###########    END FILTER FUNCTIONS    ########### */


    

    createHtmlWidget()
}
