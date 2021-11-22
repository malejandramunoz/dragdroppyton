import lexer

while True:
    text = input('input  >')
    result, error = lexer.runTest(text)
    
    if error: print(error.as_string())
    else: print(result)
