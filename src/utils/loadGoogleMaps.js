export default function loadGoogleMaps(apiKey, libraries = []) {
    if (typeof window === 'undefined') return Promise.reject(new Error('No browser window'));
    if (window.google && window.google.maps) return Promise.resolve(window.google);

    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-google-maps-loader]');
        if (existing) {
            existing.addEventListener('load', () => {
                if (window.google && window.google.maps) resolve(window.google);
                else reject(new Error('Google Maps failed to load'));
            });
            existing.addEventListener('error', () => reject(new Error('Google Maps script error')));
            return;
        }

        window.__initGoogleMaps = () => {
            if (window.google && window.google.maps) {
                resolve(window.google);
                delete window.__initGoogleMaps;
            } else {
                reject(new Error('Google object not available after callback'));
            }
        };

        const script = document.createElement('script');
        script.setAttribute('data-google-maps-loader', 'true');
        const libs = libraries.length ? `&libraries=${libraries.join(',')}` : '';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${libs}&callback=__initGoogleMaps`;
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Google Maps script failed to load'));
        document.head.appendChild(script);
    });
}
