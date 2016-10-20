// Общее описание алгоритма:
//
// 1. index = 1
// 2. Выбираем строку с номером index.
// 3. Если строка с номером index существует, переходим к п.4,
//     иначе конец алгоритма.
// 4. Если строка начинается с "frontend https", переходим к п.4.1, иначе к п.5.
//    4.1. Проходим все табулированные строки до следующего конфига,
//            доставая с помощью регулярных выражений нужные данные.
//    4.2. index = индекс последней табулированной строки.
//    4.3. Переходим к пункту 1.
// 5. index = index + 1

const os = require('os')

/**
 * Selects frontends with ssl key and all
 * domains with related asl's
 * @param  {string} data stringified config file
 * @return {string}      parsed data
 */
function parseConfig (data) {
  let splittedData = data.split(/\r?\n/)
  let retval = ''

  for (var i = 0; i < splittedData.length; i++) {
    if (matchFrontendBeginning(splittedData[i])) {
      let [formattedFrontend, newIndex] = ejectFormattedFrontend(splittedData, i + 1)
      retval += formattedFrontend + os.EOL
      i = newIndex
    }
  }
  return retval.trim()
}

/**
 * Helper function.
 * Parses intended chunk of data.
 * @param  {string}            data array with lines config file
 * @param  {integer} i         index of line with first intended line of frontend part
 * @return {[string, integer]} parsed tabulated data and index of last intended line
 */
function ejectFormattedFrontend (data, i) {
  let retval = ''
  while (isEmptyOrTabulated(data[i])) {
    // Iterate through intended chunk
    let line = data[i]

    let host = matchHostAddress(line)
    if (host) {
      // Append host address to string
      retval += host[1] + os.EOL
      i++
      continue
    }

    let acl = matchAclDomains(line)
    if (acl) {
      // Append acl and domains to string
      retval += '    ' + acl[1] + os.EOL

      let domainsArr = acl[2].split(/\s+-i\s+/g)
      let domainsStr = ''
      for (var j = 1; j < domainsArr.length; j++) {
        domainsStr += '        ' + domainsArr[j] + os.EOL
      }
      retval += domainsStr
    }
    i++
  }
  return [retval, i - 1]
}

function matchFrontendBeginning (line) {
  return line.startsWith('frontend https')
}

function matchHostAddress (line) {
  return line.match(/bind (.+):/)
}

function matchAclDomains (line) {
  return line.match(/([^\s]+) hdr_end\(host\)(.+)$/)
}

function isEmptyOrTabulated (line) {
  return (/^(\t{2}| {4}[^ ])/.test(line) || line === '')
}

module.exports.parseConfig = parseConfig
