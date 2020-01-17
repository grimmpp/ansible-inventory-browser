class HistoryManager {

    constructor(defaultPatamters = {}) {
        this.urlParameterMap = defaultPatamters
        this.functionMap = {}
        this.loadUrlParameters()
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

    setHanlder(key, func) {
        this.functionMap[key] = func
    }

    triggerPageByParameters() {
        Object.keys(this.urlParameterMap).forEach(key => {
            if (this.functionMap[key] !== undefined) {
                var value = this.urlParameterMap[key]
                this.functionMap[key](value)
            } 
            else {
                console.log("There is no function set for url parameter %s", key)
            }
        })
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