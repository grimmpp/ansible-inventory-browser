class HistoryManager {

    constructor() {
        this.urlParameterMap = {}
        this.loadUrlParameters()
        // this.setDefaultUrlParameters()
    }
    /**
    * #view=hosts;
    */
    
    loadUrlParameters() {
        var index = window.location.href.indexOf('?')
        if (index > -1 && window.location.href.length > index+2 ) {
            var hashVars = window.location.href.substring(window.location.href.indexOf("?")+1);
            hashVars.split('&').forEach(pair => {
                var key = decodeURIComponent(pair.split('=')[0])
                var value = decodeURIComponent(pair.split('=')[1])
                // console.log("key: "+key+", value: "+value)
                this.urlParameterMap[key] = value
            })
        }
    }

    setDefaultUrlParameters() {
        if(this.urlParameterMap['view'] == undefined) this.urlParameterMap['view'] = 'Hosts'
        if(this.urlParameterMap['filter'] == undefined) this.urlParameterMap['filter'] = ''
        if(this.urlParameterMap['selectedObject'] == undefined) this.urlParameterMap['selectedObject'] = ''
    }

    triggerPageByParameters() {
        if(this.urlParameterMap['view'] != undefined) {
            var view = this.urlParameterMap['view']
            if (['Hosts', 'Groups', 'Analyse', 'JSON'].includes(view))
            $('#bt'+view).trigger('click');
        } 

        if (this.urlParameterMap['filter'] != undefined) {
            $('#filterTextField').val(this.urlParameterMap['filter'])
            $('#filterTextField').trigger('keyup')
        }

        if(this.urlParameterMap['selectedObject']) {
            // find row
            var TR = null
            $('#scrollableTable > tbody > tr').each( (index, _TR) => {
                if (_TR.getAttribute('findStr') == this.urlParameterMap['selectedObject'] ) TR = _TR
            })
            
            if (TR != null) {
                var TR_ID = TR.getAttribute('id')
                $('#'+TR_ID).trigger('click')
                TR.scrollIntoView()
            }
            else {
                this.setParameters({selectedObject: ''})
            }
        }
    }

    setParameters(map = {}) {
        Object.keys(map).forEach(key => {
            this.urlParameterMap[key] = map[key]
        })

        this.refreshUrl()
    }

    getParameter(key) {
        return this.urlParameterMap[key]
    }

    refreshUrl() {
        var url = new URL(window.location.href)
        Object.keys(this.urlParameterMap).forEach(key => {
            var eKey = encodeURI(key)
            var eValue = encodeURI(this.urlParameterMap[key])

            if (eValue.length > 0) url.searchParams.set(eKey, eValue)
            else url.searchParams.delete(eKey)
        })

        // window.history.pushState({}, '', url.toString())
        window.history.replaceState({}, '', url.toString())
    }
}