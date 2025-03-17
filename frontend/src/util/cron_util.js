import { parseCronExpression } from 'cron-schedule'
import { isValidCron } from 'cron-validator'
import cronstrue from 'cronstrue'


export function upcomingDatetimes(expression, currentTime, nextXOccurences) {
    const cron = parseCronExpression(expression)
    return cron.getNextDates(nextXOccurences, currentTime).map(date => date.toISOString())
}


export function ToStringToISO(dateStrings) {
    return dateStrings.map(dateString => {
        const date = new Date(dateString);
        return date.toISOString();
    });
}

export function cronDescription(expression) {
    try {
        let description = cronstrue.toString(expression)
        description = description.replace(/^.*?at\s+/, '')
        if (!description || description.includes('undefined')) {
            return ''
        }
        return description
    } catch (e) {
        return e.message
    }
}

export function cronValidate(expression) {
    return isValidCron(expression)
}

