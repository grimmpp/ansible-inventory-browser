
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
                $('<th>').append($('<div>').text(value))
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
            $(this).children().first().width( $(this).width() )
            $(this).width( $(this).width() )
        })
        // remove text from th
        $('#'+id+' > thead > tr > th').children('span').remove()

        refreshHeaderBackground()
    }

    var refreshHeaderBackground = function() {
        if (isTreeTable) {
            $('#scrollableTableHeader > tr > th > div').removeClass('scrollableTableHeaderBackground')
        } else {
            $('#scrollableTableHeader > tr > th > div').addClass('scrollableTableHeaderBackground')
        }
    }

    this.setTreeTableContent = function(data, eventType, columns, subtreePropertyName) {
        isTreeTable = true
        fillTable(data, eventType, columns, subtreePropertyName)

        root.adjustHeaderSize()
    }

    this.setTableContent = function(data, eventType, columns) {
        isTreeTable = false
        fillTable(data, eventType, columns)

        root.adjustHeaderSize()

        $('#scrollableTable').tablesorter(); 
    }

    var fillTable = function(data, eventType, columns, subtreePropertyName="") {
        $('#'+id+' > tbody').empty()
        lastSelectedRow = ""

        // Fill content
        $.each(data, function(index) {
            createRow(data, index, eventType, columns, subtreePropertyName)
        })
    }

    var createRow = function(data, index, eventType, columns, subtreePropertyName) {
        var indexes = [index]
        createChildRow(data, index, eventType, columns, subtreePropertyName, null,"",1, indexes);
    }

    var createChildRow = function(data, index, eventType, columns, subtreePropertyName, insertAfterElem, parentId, level, parentIndexes) {
        const rowId = id+'_rowId_'+ (++lastRowId)

        var trElem = $('<tr>').attr('id', rowId).attr('level', level).attr('parentId', parentId)

        // var nestedIndex = "";
        // if ( (""+parentIndex).length > 0) nestedIndex = parentIndex +","+index
        // else nestedIndex = index

        if (isTreeTable) trElem.click(() => { root.selectTreeTableRow(rowId, eventType, parentIndexes) })
        else trElem.click(() => { root.selectRow(rowId, eventType, index) })

        const distText = level*16
        const distIcon=(level-1)*16

        $.each(columns, function(c_index, c_value) {
            trElem.append($('<td>').attr('parentId', parentId).text(data[index][c_value]))
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
        
        $( "td[parentId='"+parentRowId+"']" ).each(function(index, elem) {
            var parentTr = $( document ).find( elem ).parent()
            if (parentTr.attr('status') == 'open') closeSubRows(parentTr.attr('id'))
        })

        $( "td[parentId='"+parentRowId+"']" ).parent().remove()
    }

    this.clearTable = function() {
        lastSelectedRow = ""
        $('#scrollableTable > thead').empty()
        $('#scrollableTable > tbody').empty()
    }

    create()
}
