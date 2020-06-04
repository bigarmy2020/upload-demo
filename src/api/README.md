# RESTFull API

```vue
<script>
	import { testApi } from '@/api';
	import { logger } from '@/utils';

	export default {
		// ...
		methods: {
			async testAPI () {
				const res = await testApi();
				logger.log('testAPI res: ', res);
			}
		}
	};
</script>
```
