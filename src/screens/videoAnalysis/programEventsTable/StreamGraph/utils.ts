// TODO: improve types here
// Shoudl probably create a generic to have `group` having be union of specific strings

// Note to self: Perhaps I should use the tidy.js library?
// https://pbeshai.github.io/tidy/docs/api/pivot/

type LongDataItem = {
    date: string;
    group: string;
    value: number;
};

export type WideDataItem = {
    date: string;
} & { [key: string]: number }

export const pivotWider = (data: LongDataItem[]) => {
    const result: WideDataItem[] = [];

    data.forEach((item) => {
        const existingEntry = result.find((entry) => entry.date === item.date);

        if (existingEntry) {
            existingEntry[item.group] = item.value;
        } else {
            const newEntry: any = { date: item.date };
            newEntry[item.group] = item.value;
            result.push(newEntry);
        }
    });

    return result;
}


export function replaceKeyInURI( uri: any, key: string, value: string ) {

    // Use window URL if no query string is provided
    if ( ! uri ) { uri = window.location.href; }

    // Create a dummy element to parse the URI with
    var a = document.createElement( 'a' ), 

        // match the key, optional square brackets, an equals sign or end of string, the optional value
        reg_ex = new RegExp( key + '((?:\\[[^\\]]*\\])?)(=|$)(.*)' ),

        // Setup some additional variables
        qs,
        qs_len,
        key_found = false;

    // Use the JS API to parse the URI 
    a.href = uri;

    // If the URI doesn't have a query string, add it and return
    if ( ! a.search ) {

        a.search = '?' + key + '=' + value;

        return a.href;
    }

    // Split the query string by ampersands
    qs = a.search.replace( /^\?/, '' ).split( /&(?:amp;)?/ );
    qs_len = qs.length; 

    // Loop through each query string part
    while ( qs_len > 0 ) {

        qs_len--;

        // Remove empty elements to prevent double ampersands
        if ( ! qs[qs_len] ) { qs.splice(qs_len, 1); continue; }

        // Check if the current part matches our key
        if ( reg_ex.test( qs[qs_len] ) ) {

            // Replace the current value
            qs[qs_len] = qs[qs_len].replace( reg_ex, key + '$1' ) + '=' + value;

            key_found = true;
        }
    }   

    // If we haven't replaced any occurrences above, add the new parameter and value
    if ( ! key_found ) { qs.push( key + '=' + value ); }

    // Set the new query string
    a.search = '?' + qs.join( '&' );

    return a.href;
}