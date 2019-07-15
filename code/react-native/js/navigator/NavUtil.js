
export default class NavigationUtil {
    static Navigation

    static back(params) {
        const { navigation } = params
        navigation.goBack()
    }

    static toHomePage(params) {
        const { navigation } = params
        navigation.navigate("Main")
    }

    static toPage(params, page) {
        const navigation = this.Navigation;
        if (!navigation) {
            console.log("No navigation found!")
        } else {
            try {
                navigation.navigate(page)
            } catch (e) {
                console.warn(e)
            }
        }
    }
}
