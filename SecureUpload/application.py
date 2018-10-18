import os
import uuid
from flask import Flask, render_template, request, flash, redirect


app = Flask(__name__)
app.config.from_pyfile('settings.py')


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            #return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            #return redirect(request.url)
        if file:
            filename = str(uuid.uuid4())
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            flash('File uploaded')
            #return redirect(request.url)

    return render_template('upload/upload.html')


if __name__ == "__main__":
    app.run()
