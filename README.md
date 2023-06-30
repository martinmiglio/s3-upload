# S3 Pattern Upload

GitHub Action to upload files to an AWS S3 bucket using a glob file pattern

```yml
name: Test Run
on: push
jobs:
  lambda:
    runs-on: ubuntu-latest
    steps:
      - run: echo "My Data" > myfileglob-${{ github.ref_name }}.txt
      - uses: martinmiglio/s3-upload@v3
        with:
          PATTERN: myfileglob*.txt # https://github.com/mrmlnc/fast-glob#pattern-syntax
          DEST: uploads/ # defaults to root of bucket
          AWS_BUCKET_NAME: temp-test-gh-action
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_SECRET_ID: ${{ secrets.AWS_SECRET_ID }}
          AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_KEY }}
```
