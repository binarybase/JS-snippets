import { ContextMenuButton, ActionSheetFallback } from 'react-native-ios-context-menu';
import { Platform } from 'react-native'
import colors from '../../assets/colors';

// retrieve IOS version for context menu
const iosVersion = parseInt(Platform.Version, 10);

export const useContextMenu = (menuConfig, onPressMenuItem) => {
	const menuProps = {
		menuConfig,
		onPressMenuItem,
		
	}

	/** displays IOS<14 actionSheet fallback */
	const showContextMenuFallback = async () => {
		const selectedItem = await ActionSheetFallback.show(menuConfig);
		if(!selectedItem)
			return;

		onPressMenuItem({
			isUsingActionSheetFallback: true,
			nativeEvent: {...selectedItem}
		})
	}

	/** IOS <14 actionSheet */
	const contextFallbackComponent = useCallback(() => (
		<TouchableOpacity style={{width: 24, marginRight: 16, alignItems: "center"}} onPress={showContextMenuFallback}>
			<FontAwesomeIcon icon="fa-ellipsis" size={28} color={colors.blue.primary} />
		</TouchableOpacity>
	), [])

	/**
	 * IOS 14+ contextMenu
	 */
	const contextMenuComponent = useCallback(() => (
		<ContextMenuButton isMenuPrimaryAction={true} style={{margin: 0, padding: 0}} {...menuProps}>
			<View style={{width: 24, marginRight: 16, alignItems: "center"}}>
				<FontAwesomeIcon icon="fa-ellipsis" size={28} color={colors.blue.primary} />
			</View>
		</ContextMenuButton>
	), []);

	return iosVersion < 14 ? contextFallbackComponent : contextMenuComponent
}