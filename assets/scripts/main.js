window.ext = {
	temp: {
		series: 0,
		stage: 0,
		sound: true,
	},
	defaultData: {
		campaignProgress: [
			[]
		],
		option: {
			sound: true,
		}
	},
	init() {
		let userStorage = this.getStorage()
		this.temp.sound = userStorage.option.sound
		cc.audioEngine.setMusicVolume(this.temp.sound ? 1 : 0);
		cc.audioEngine.setEffectsVolume(this.temp.sound ? 1 : 0);
	},
	toggleSound() {
		let userStorage = this.getStorage()
		userStorage.option.sound = !userStorage.option.sound
		this.temp.sound = userStorage.option.sound
		this.saveStorage(userStorage)
		cc.audioEngine.setMusicVolume(this.temp.sound ? 1 : 0);
		cc.audioEngine.setEffectsVolume(this.temp.sound ? 1 : 0);
	},
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	getStorage() {
		let userStorage = cc.sys.localStorage.getItem('userStorage')
		if (!userStorage) {
			cc.sys.localStorage.setItem('userStorage', JSON.stringify(this.defaultData));
		}
		return JSON.parse(cc.sys.localStorage.getItem('userStorage'))
	},
	saveStorage(userStorage) {
		cc.sys.localStorage.setItem('userStorage', JSON.stringify(userStorage));
	},
	//这里的参数都从0开始计算，第一关通过了，那么传的stage应该是0
	//stage中的series和stage属性都加了1，比较容易搞混
	//是因为为了匹配关卡json文件名
	//总的来说，问题只有这里的差异与seriesProgress的语义问题
	updateCampaignProgress(series, stage) {
		let userStorage = this.getStorage()
		userStorage.campaignProgress[series][stage] = true
		this.saveStorage(userStorage)
	},
	//这个获取的进度主要是为了对应可选择的关卡进度，所以campaignprogress(从0开始计算)的长度要+1
	//比如通过了29关,30关就可以玩了，那么长度这时是29，所以+1
	//语义上来讲，这代表关卡进行到了第几关
	getSeriesProgress(series) {
		let userStorage = this.getStorage()
		if (!userStorage.campaignProgress[series]) {
			userStorage.campaignProgress[series] = []
			this.saveStorage(userStorage)
		}
		return userStorage.campaignProgress[series].length + 1
	}
}