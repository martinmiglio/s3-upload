# s3-upload

Github Action to Upload to S3 Bucket

Uploads to S3 Bucket

```yml
name: Test Run
on: push
jobs:
  lambda:
    runs-on: ubuntu-latest
    steps:
      - run: echo "My Data" > myfileglob-${{ github.ref_name }}.txt
      - uses: martinmiglio/s3-upload@v1
        with:
          PATTERN: myfileglob*.txt
          DEST: uploads/
          AWS_BUCKET_NAME: temp-test-gh-action
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_SECRET_ID: ${{ secrets.AWS_SECRET_ID }}
          AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_KEY }}
```
