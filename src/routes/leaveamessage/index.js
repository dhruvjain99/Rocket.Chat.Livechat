import { h, Component } from 'preact';
import { asyncEvery } from '../../components/helpers';
import style from './style';
import Header, {
	Title, Content,
} from 'components/Header';
import { Form, InputField, Item } from 'components/Form';
import Button from 'components/Button';
import * as Footer from 'components/Footer';

export default class Home extends Component {
	async submit(event) {
		event.preventDefault();
		if (await this.validate()) {
			this.props.onSubmit(Array.from(this.state.fields).map((el) => [el.props.name, el.value]).reduce((values, [key, value]) => ({ ...values, [key]: value }), { }));
		}
	}

	async validate() {
		const valid = await asyncEvery(Array.from(this.state.fields), async(el) => await el.validate());
		this.setState({
			valid,
		});
		return valid;
	}

	addToValidate(element) {
		this.state.fields.add(element);
	}

	constructor(props) {
		super(props);
		this.state = {
			valid: false,
			fields: new Set(),
		};
		this.submit = this.submit.bind(this);
		this.validate = this.validate.bind(this);
		this.addToValidate = this.addToValidate.bind(this);
	}

	componentDidMount() {
		this.validate();
	}

	render({ color, title, message, loading, emailPlaceholder = 'insert your e-mail here...', namePlaceholder = 'insert your name here...', messsagePlaceholder = 'write your message...' }) {
		return (<div class={style.container}>
			<Header color={color}>
				<Content>
					<Title>{title}</Title>
				</Content>
			</Header>
			<main class={style.main}>
				<p>{message}</p>
				<Form ref={(form) => this.formEl = form} onSubmit={this.submit} noValidate>
					<InputField disabled={loading} required onChange={this.validate} ref={this.addToValidate} validations={['notNull']} name="name"
						placeholder={namePlaceholder}
						label="Name"
					/>
					<InputField disabled={loading} required onChange={this.validate} ref={this.addToValidate} validations={['notNull', 'email']} name="email"
						placeholder={emailPlaceholder}
						label="E-mail"
					/>
					<InputField
						disabled={loading}
						multiple={4}
						required
						onChange={this.validate}
						ref={this.addToValidate}
						validations={['notNull']}
						name="message"
						placeholder={messsagePlaceholder}
						label="Message"
					/>
					<Item>
						<Button loading={loading} disabled={!this.state.valid || loading} stack>Send</Button>
					</Item>
				</Form>
			</main>
			<Footer.Main>
				<Footer.Content><Footer.PoweredBy /></Footer.Content>
			</Footer.Main>
		</div>);
	}
}