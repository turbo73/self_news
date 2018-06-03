function csrftoken(request, next) {
    request.headers.set('X-CSRFTOKEN', Cookie.get('csrftoken'))
    next();
}