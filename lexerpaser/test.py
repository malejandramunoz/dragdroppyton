import lexerpaser

while True:
    text = input('input  >')
    result, error = lexerpaser.run('<stdin>', text)
    
    if error: print(error.as_string())
    else: print(result)
