# AWS CloudWatch Colorizer

The start is the first step

by _Markuss9_

## Distribution

Published on [Chrome Web Store](https://chromewebstore.google.com/detail/aws-cloudwatch-colorizer/ncenlceeghmojbnnbleckijobaiikfio)

## DEV

Generate test data with current timestamps and pipe it directly to AWS CLI

```shell
node generate-test-data.js | aws logs put-log-events \
  --log-group-name my-log-group \
  --log-stream-name my-log-stream \
  --log-events file:///dev/stdin
```

If your shell doesn't support `/dev/stdin`, save to a file first:

```shell
node generate-test-data.js > /tmp/test-events.json
aws logs put-log-events \
  --log-group-name my-log-group \
  --log-stream-name my-log-stream \
  --log-events file:///tmp/test-events.json
```



## For migrating to shadcn


color picker

https://www.shadcn.io/components/color-picker
