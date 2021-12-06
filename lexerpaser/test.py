import lexerpaser

while True:
    with open("/Users/alejandramunoz/Downloads/code.txt") as content: 
        text = content.read() 

    result, error = lexerpaser.run('<stdin>', text)
    
    if error: print(error.as_string())
    else: print(result)
    
