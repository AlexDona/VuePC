<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <el-image class="logoStyle" :src="logoUrl" />
        <h4 class="title title2">欢迎登录</h4>
      </div>

      <el-form-item prop="username">
        <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>-->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入手机号码"
          name="username"
          type="text"
          tabindex="1"
          maxlength="11"
          autocomplete="on"
        />
      </el-form-item>
      <SliderCheck :success-fun="handleSuccessFun" :error-fun="handleErrorFun" :reset-slider="resetSlider" />
      <el-form-item class="passwordStyle" prop="password">
        <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>-->
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入验证码"
          type="text"
          tabindex="3"
          maxlength="6"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="img" @click="requestCode">{{ countTime === 60 ? '获取验证码' : countTime + 's后重试' }}</span>
      </el-form-item>
      <!-- <div class="form-container">
        <el-checkbox v-model="loginForm.remember">记住用户名</el-checkbox>
      </div> -->
      <el-row>
        <el-col class="loginXyChecked">
          <el-form-item>
            <el-checkbox v-model="loginXyChecked">
              <span>
                我已阅读并同意《<i class="underline" @click="instructionsVisible = true">平台服务协议</i>》及《<i class="underline" @click="instructionsVisible2 = true">隐私政策</i>》
              </span>
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-button
        :loading="loading"
        type="primary"
        :disabled="!loginXyChecked"
        style="width: 80%;height: 40px;margin-bottom: 50px;"
        @click.native.prevent="handleLogin()"
      >登录</el-button>
    </el-form>

    <el-dialog title="请选择公司" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
      <div class="companyList">
        <el-radio-group v-model="radio">
          <template v-for="item in radioListData">
            <el-radio :key="item.customerId" :label="item.customerId">{{ item.customerName }}</el-radio>
          </template>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChooiseCompany()">取 消</el-button>
        <el-button type="primary" @click="checkedCompany()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :close-on-click-modal="false" :visible.sync="instructionsVisible" width="60%">
      <div class="instructions">
        <h2 style="text-align:center;">平台服务协议</h2>
        <div>发布日期：2022 年1月13日</div>
        <div>实施日期：2022年 1月13日</div>
        <p><b>【提示】本协议已对与您的权益有或可能具有重大关系的条款，及对本平台具有或可能具有免责或限制责任的条款用粗体字予以标注，请您注意。</b></p>
        <p>本平台由<u> 悟新（深圳）数字科技有限公司   </u>负责运营（以下“本平台”均指悟商通系统平台（https://ddf.wxsksystem.com，https://ddfh5.wxsksystem.com）及<u> 悟新（深圳）数字科技有限公司</u>（下称“悟新数科”））。本平台服务协议签约双方为悟新数科与本平台注册用户（下称“您”或“用户”），本协议经您勾选确认后即具有合同效力，适用于您在本平台的全部活动。</p>
        <p>请您在注册成为用户前务必仔细阅读本协议，若您不同意本协议的任意内容，或者无法准确理解条款内容及其解释，请不要进行后续操作；<b>您只要在“我已阅读并同意《平台服务协议》”前的选择框里打勾并按照本平台规定的登录并使用，您的行为即表示同意并签署了本协议。您同时承诺遵守中国法律、法规、规章及其他政府规范性文件的规定，如有违反而造成任何法律后果，您将以本人名义独立承担所有相应的法律责任。</b></p>
        <p>平台服务协议（下称“本协议”）内容包括以下条款及已经发布的或将来可能发布的各类规则。所有规则为协议不可分割的一部分，与协议正文具有同等法律效力。悟新数科有权根据需要不定时地制定、修改本协议或各类规则，如本协议及规则有任何变更，一切变更以本平台最新公布的内容为准。</p>
        <p>经修订的协议、规则一经公布，立即自动生效，对新协议、规则生效之后注册的使用者发生法律效力。对于协议、规则生效之前注册的使用者，若用户在新规则生效后继续使用本平台提供的各项服务，则表明使用者已充分阅读并认可和同意遵守新的协议或规则。若您拒绝接受新的协议和规则，您必须放弃使用悟新数科提供的该项服务。</p>
        <p>本协议不涉及您与本平台的其他用户之间因操作行为而产生的法律关系及法律纠纷，但您在此同意将全面接受和履行您与本平台其他用户在本平台签订的任何电子法律文本，并承诺按该法律文本享有和/或放弃相应的权利、承担和/或豁免相应的义务。</p>
        <h4>目录</h4>
        <h4>一、使用限制</h4>
        <h4>二、身份认证</h4>
        <h4>三、账户安全</h4>
        <h4>四、个人信息的使用</h4>
        <h4>五、责任限制</h4>
        <h4>六、知识产权</h4>
        <h4>七、服务的中止或终止</h4>
        <h4>八、附加条款</h4>
        <h4>九、争议解决</h4>
        <h4>十、投诉和咨询</h4>
        <h4>十一、其他</h4>
        <h4>一、使用限制</h4>
        <p>1.1本平台网站内容（包括但不限于文本、数据、文章、设计、源代码、软件、图片、照片及其他全部信息）受中华人民共和国著作权法及各国际版权公约的保护。您承诺不以任何方式、不以任何形式复制、模仿、传播、出版、公布、展示网站内容，包括但不限于电子的、机械的、复印的、录音录像的方式和形式等。您亦不得将本平台包含的资料等任何内容镜像到任何其他网站或者服务器。任何未经授权对网站内容的使用均属于违法行为，本平台将追究您的法律责任。</p>
        <p>1.2您承诺合法使用本平台提供的服务及网站内容。禁止在本平台从事任何可能违反中华人民共和国现行的法律、法规、规章和政府规范性文件的行为或者任何未经授权使用本平台的行为，如擅自进入本平台的未公开的系统、不正当的使用密码和网站的任何内容、窃取他人的账号和密码、窃取他人的个人隐私信息等。</p>
        <h4>二、身份认证</h4>
        <p>2.1【身份认证要素】</p>
        <p><b>指本平台用于识别您身份的信息要素，包括但不限于您及您法定代表人/实际控制人/操作人员/经营者的用户名、密码、数字证书、短信校验、签约时设置的电话号码、手机号码及本平台认可的其他要素。</b></p>
        <p>2.2【身份认证要素的保管】</p>
        <p>身份认证要素是本平台识别您的依据，您必须妥善保管，不得将身份认证要素提供给任何第三方或交于任何第三方使用。使用上述身份要素所发出的一切指令均视为您本人所为，您应对此产生的后果负责。由于非本平台原因导致的您的账户、密码等信息被冒用、盗用或非法使用，而引起的一切风险、责任、损失、费用等应由您自行承担。</p>
        <p>2.3【账号实名认证】</p>
        <p>您在申请进行实名认证时，应提供真实、准确、完整、合法且有效的注册数据及真实资料，<b>并保证诸如电子邮件地址、联系电话、联系地址、邮政编码等内容的有效性及安全性。</b>当您的数据发生变动时，应及时进行更新，如涉及名称、统一信用代码正、税务登记证、法定代表人姓名等信息变动的，须经本平台审核后生效。<b>如您因网上操作行为与其他用户产生诉讼的，其他用户有权通过司法部门要求网站提供相关资料。</b></p>
        <p>根据实名认证方式的不同，具体认证数据内容存在一定差异，具体数据要求，以您提交实名认证时弹出的数据清单为准。</p>
        <p>2.4【授权审查】</p>
        <p>您同意并授权本平台审查、核对您的数据以确认您的身份，包括但不限于向第三方信息机构进行数据的比对核验。本平台进行的数据审查不阻断您就所提供数据真实性所承担的一切法律责任。本平台对您进行身份验证，并据此决定提供服务的范围及为您开放服务种类、范围及进行业务操作的权限。为保障您的信息安全，本平台有权根据您类别、身份认证措施、交易风险度等因素的不同设定不同的安全策略。</p>
        <p>2.5【注册主体资格】</p>
        <p>本平台仅接受依据中华人民共和国法律在中华人民共和国境内（香港、台湾、澳门除外）设立的，能够独立承担民事责任的法人和其他组织。如您不符合资格，请勿登录并使用，否则本平台保留随时中止或终止您用户资格的权利。您在此向本平台保证，您已符合平台身份条件，如因您向本平台提供虚假信息或承诺而导致本平台蒙受任何损失，您将承担全部责任并赔偿相关损失。</p>
        <h4>三、账户安全</h4>
        <p>3.1您的账户信息是其登录本平台的唯一信息，本平台将通过校验您的用户登录名及密码识别其后续相关操作，您应当妥善保管自身用户名称及密码，由于密码保管不善导致的任何损失均由您自行承担，<b>本平台对您的用户名和密码的遗失或被盗取所产生的后果不承担任何责任。</b>涉及企业授权范围调整等重大事项，本平台将通过校验您用户的电子签名的方式进行身份核验，请相关用户无比妥善保管相应数字证书凭证，凡通过企业用户有效电子签名核验完成确认的操作所产生的法律后果，均由您自行承担。</p>
        <p><b>3.2您注册成功后，不得将本平台的用户名转让给第三方使用。您确认，您用您的用户名和密码登录本平台后在本平台的一切行为均代表您本身作出的行为并由您承担相应的法律后果。任何利用您的用户名以及密码登录本平台并从事任何活动均将被视为您的行为。因此，您有义务非常谨慎的保管自己的用户名以及密码。</b></p>
        <p>3.3本平台可以暂时停止提供或者限制本平台部分功能，或提供新的功能，在任何功能减少、增加或者变化时，只要您仍然使用本服务，即表示同意本协议或者变更后的协议。</p>
        <p><b>3.4为满足您的业务需要，您授权本平台向其他第三方机构收集、调取您的数据，以核实用户身份、信用等情况。</b></p>
        <p>3.5您不得利用本平台或本平台服务从事任何不符合中华人民共和国法律法规或侵犯他人权益的活动，不得自行发布、转载或传送含有以下任意内容之一的信息，本平台在发现用户从事或发布相关信息时，有权基于本平台独立判断直接删除用户在本平台发布或提交的任何信息，并有权立即停止用户在本平台的全部或部分功能而无需通知用户，且不承担任何责任。由于用户违规行为给平台造成损失，平台有权要求相关用户予以赔偿。违规信息包括但不限于：</p>
        <p>（1）违反宪法确定的基本原则的；</p>
        <p>（2）危害国家安全、泄露国家机密、颠覆国家政权、破坏国家统一的；</p>
        <p>（3）损害国家荣誉或利益的；</p>
        <p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
        <p>（5）破坏国家宗教政策，宣扬邪教或封建迷信的；</p>
        <p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
        <p>（7）散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；</p>
        <p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p>
        <p>（9）煽动非法集会、结社、游行、示威，聚众扰乱社会秩序的；</p>
        <p>（10）以非法民间组织名义活动的；</p>
        <p>（11）含有蓄意毁坏、恶意干扰、秘密地截取或侵占任何系统、数据或个人资料的任何病毒、伪装破坏程序、电脑蠕虫、定时程序炸弹或其他电脑程序的。</p>
        <p>（12）包含法律、法规禁止的其他内容的。</p>
        <p>3.6您确认并同意本平台有权不时地根据法律、法规、政府要求透露、修改、屏蔽或者删除必要的、合适的信息，以便更好地运营本平台并保护本平台的用户的合法权益。</p>
        <h4>四、个人信息的使用</h4>
        <p>4.1本平台对收集的用户个人信息将严格保密，并采取技术措施和其他必要措施，确保信息安全，防止用户个人信息泄露、丢失。在发生或者可能发生信息泄露、丢失的情况时，本平台将立即采取补救措施。</p>
        <p>4.2本平台不会对外公开或向第三方提供您的资料及您在使用本软件服务时所存储的非公开内容，但下列情况除外：（1）已事先获得您的授权；（2）您主动通过本平台的第三方接口发出申请；（3）根据法律法规及相关政府主管部门、司法机关的要求；（4）本平台在与第三方合作向您提供相关服务且该第三方同意承担与本平台同等的保护您隐私的责任；（5）本平台及本平台委托的第三方对整个用户数据库进行分析或调查研究，并对用户数据库进行商业上的利用。</p>
        <p><b>4.3为向您提供一站式融资服务及其他增值服务，本平台有权收集、查询、存储、使用您的信息，并提供给相应的金融机构或其他与本平台合作的第三方。您授权本平台向您采集或向您的供货方查询以上信息。</b></p>
        <h4>五、责任限制</h4>
        <p>5.1基于互联网的特性，本平台无法保证平台的服务不会中断，对于包括但不限于本平台及相应的服务商设备、系统存在缺陷、计算器发生故障、遭遇病毒、黑客攻击或者发生地震、海啸等不可抗力导致的服务中断或无法使用，继而引发的网上交易无法完成或信息、记录丢失的，本平台会合理地尽力协助完成善后处理，但本平台不对由此导致的损失承担任何赔偿责任（包括但不限于利润、商誉、数据方面的有形、无形损失）。具体免责场景包括：</p>
        <p>（1）本平台日常系统停机维护期间。</p>
        <p>（2）电信设备出现故障不能进行数据传输的。</p>
        <p>（3）由于黑客攻击、网络供应商技术调整或故障、网站升级、银行方面的问题等原因而造成的服务中断或延迟。</p>
        <p>（4）因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成系统障碍不能执行业务的。</p>
        <p>5.2本平台无义务监测网站内容，用户对于本平台提供的信息应自行判断选用，并自行承担相应风险。</p>
        <p>5.3本平台的内容可能涉及对第三方所有网站的信息调用，该等信息及第三方网站的真实性、可靠性、有效性等由信息提供方进行确认保障，用户应自行判定相应信息真伪并自主完成各项操作，用户通过第三方网站办理的各项业务与本平台无关。</p>
        <p>5.4用户通过本平台与第三方机构办理各项业务，应与第三方机构另行签署相应服务协议，本平台可根据用户或第三方机构授权提供相应协助，但本平台对于用户与第三方机构协议的履行不承担任何责任。</p>
        <p><b>5.5除非本平台或其合作方在特定交易成立后的电子协议书中明示承担责任外，本平台提供的服务中不带有对本平台中的任何用户、任何操作或行为的任何保证。本平台将勤勉尽责地对其他用户或机构提供的信息进行审查，但由于本平台不可控制的因素，本平台无法保证其他用户或机构提供的内容一定具备真实性、充分性、及时性、可靠性、完整性和有效性。</b></p>
        <h4>六、知识产权</h4>
        <p>6.1悟新（深圳）数字科技有限公司作为本平台的运营商，拥有本平台及其相应移动应用程序完整有效的商标、著作权等知识产权，受国家法律保护，未经本平台明确书面授权，任何单位或个人均不得以任何方式使用本平台内容，如有使用，平台有权追究其法律责任。</p>
        <p>6.2本平台所刊载的数据信息（包括但不限于文本、图标、标识、设计、源代码、图像、声音片段、数字下载、数据编辑和软件等），均为本平台或其提供者的专属财产，受中国或国际版权公约保护。平台上所有的内容汇编均为平台排他的专属财产，受中国或国际版权公约保护。平台上所有软件都是平台或其关联公司或其软件供货商专属财产，受中国或国际版权公约保护。未经本平台明确书面同意，任何单位或个人均不得将其镜像到其他任何网站或服务器，如有使用，平台有权追究其法律责任。</p>
        <h4>七、服务的中止或终止 </h4>
        <p>7.1除非本平台终止本协议或者您申请终止本协议及注销相应用户账户且经本平台同意，否则本协议始终有效。在您违反了本协议、相关规则，或在相关法律法规、政府部门的要求下，本平台有权通过包括但不限于电子邮件、平台内消息、短信等告知方式终止本协议、关闭您的账户或者限制您使用本平台。但本平台的终止行为不能免除您根据本协议或在本平台生成的其他协议项下的还未履行完毕的义务。</p>
        <p>7.2发生下列情形之一的，本平台有权随时中止向您提供服务，但在问题消除后，本平台将继续向您提供服务：</p>
        <p>（1）对于网络设备进行必要的保养及施工时；</p>
        <p>（2）出现突发性的网络设备故障时；</p>
        <p>（3）本平台所使用的网络通信设备由于不明原因停止，无法提供服务时；</p>
        <p>（4）其他需要暂时停止向您提供服务的情形。</p>
        <p>7.3发生下列情形之一的，本平台有权随时中止或终止向您提供服务而无需通知您：</p>
        <p>（1）由于不可抗力因素致使本平台无法提供线上服务时；</p>
        <p>（2）基于相关政府机构的要求；</p>
        <p>（3）您提供的个人资料不准确，不真实，不合法有效；</p>
        <p>（4）您使用任何第三方程序进行登录或使用服务；</p>
        <p>（5）您滥用所享受的权利；</p>
        <p>（6）您有损害其他用户的行为；</p>
        <p>（7）您有违背社会风俗和社会道德的行为；</p>
        <p>（8）您有违反本协议中相关规定的行为；</p>
        <p>（9）您存在洗钱或其他违反法律法规强制性、禁止性规定的行为。</p>
        <p>7.4如因系统维护或升级的需要而需暂停网络服务，本平台将尽可能事先进行通告。</p>
        <p>7.5终止对您的服务后，您使用本平台服务的权利立即终止。从终止您的服务即刻起，本平台不再对您承担任何责任和义务。</p>
        <h4>八、附加条款</h4>
        <p><b>8.1本平台有权根据需要不时地制定、修改本协议或各类规则，并要求您重新勾选确认。您应不时地注意本协议及附属规则的变更， 若您不同意相关变更，本平台有权因您未勾选同意变更后本协议及附属规则，而中止/终止本协议或者限制您进入本平台的全部或者部分板块且不承担任何法律责任。但该中止、终止或者限制行为并不能豁免您在本平台已经进行的交易下所应承担的义务。</b></p>
        <p><b>8.2本平台有权采取如下一项或者多项措施发送通知：（1）依据您向本平台提供的电子邮件地址发送电子邮件；（2）依据您提供的联系地址寄送信件；（3）在无线客户端上进行公告；（4）在合作伙伴网站上公布；（5）发送手机短信；（6）电话通知；（7）本平台站内信等。</b></p>
        <p><b>8.3在本平台的某些部分或页面中、或者您使用本平台相关服务产品的过程中，可能存在除本协议以外的单独的附加服务条款或协议，当这些服务条款或协议与本协议条款及规则存在冲突时，则前述本协议条款和规则以外的服务条款或协议将优先适用。</b></p>
        <p>8.4就任何第三方提出的，由于您违反本协议及纳入本协议的条款和规则或您违反任何法律、法规或侵害第三方的权利而产生或引起的每一种类和性质的任何索赔、要求、诉讼、损失和损害（实际的、特别的及有后果的），无论是已知或未知的，包括合理的律师费，您同意就此对本平台和本平台的母公司、子公司、关联公司、高级职员、董事、代理人和雇员（如适用）进行补偿并使其免受损害。</p>
        <p>8.5若本协议的部分条款被认定为无效或者无法实施时，本协议中的其他条款仍然有效。</p>
        <h4>九、争议解决</h4>
        <p>9.1用户通过本平台接受第三方服务或通过本平台完成协议签署后，与其合同相对方之间发生的争议，均由用户与其交易对手自行协商处理。</p>
        <p>9.2用户与本平台发生的争议，应由用户与本平台协商解决，协商不成的，任意一方均可向深圳市南山区有管辖权的人民法院诉讼解决。</p>
        <p>9.3本平台及本协议各类事项均适用中华人民共和国大陆地区有效法律，如本协议或本平台其他规则中的任意一条被视为废止、无效或不可执行，该条款的废止、无效或不可执行不影响其他条款的有效性和可执行性。</p>
        <h4>十、投诉和咨询</h4>
        <p>若您在使用本平台的过程中有任何的疑问、投诉和咨询，可随时致电客服热线：0755-86169969</p>
        <h4>十一、其他</h4>
        <p>11.1本协议有本协议条款及平台其他业务规则共同组成，本协议中未尽事宜应按照相关业务具体规则理解与处理。</p>
        <p>11.2本协议自用户同意勾选并成功注册为本平台用户之日起生效。除非本平台终止本协议或者用户丧失本平台用户资格，否则本协议始终有效。本协议终止并不免除用户根据本协议或其他有关协议、规则所应承担的义务和责任。</p>
        <p>11.3如非特别指明，本协议条款适用于全体平台注册用户。</p>
        <p>11.4本协议中的标题仅为方便而设，在解释本协议时应被忽略。</p>
        <p>11.5悟新数科对本服务协议享有最终的解释权。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancelAgreeRegister()">取 消</el-button> -->
        <el-button @click="agreeAndRegister()">关 闭</el-button>
        <!-- <el-button type="primary" :disabled="countStr !== 0" @click="agreeAndRegister()">
          同意并注册
          <span v-if="countStr">({{ countStr }}s)</span>
        </el-button> -->
      </span>
    </el-dialog>
    <el-dialog title="" :close-on-click-modal="false" :visible.sync="instructionsVisible2" width="60%">
      <div class="instructions">
        <h2 style="text-align:center;">隐私政策</h2>
        <div>更新日期：2021年【01】月【13】日</div>
        <div>生效日期：2021年【01】月【13】日</div>
        <p>您的信任对悟新（深圳）数字科技有限公司（以下简称“我们”）非常重要，我们深知用户信息安全的重要性，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的用户信息安全可控。鉴此，我们制定《悟商通平台隐私政策》（下称“本隐私政策”）并提醒您：</p>
        <p><b>在您使用【悟商通平台】前，请您务必认真阅读本隐私政策，充分理解各条款内容，包括但不限于免除或限制我们责任的条款。您知晓并确认，您勾选“我已阅读《平台服务协议》《隐私政策》”并使用【悟商通平台】，就表示您同意我们按照本隐私政策处理您的信息。</b></p>
        <p><b>请您知悉，本政策仅适用于我们通过【悟商通平台】向您提供服务所收集的信息，不适用于通过接入【悟商通平台】以向您提供产品或服务的第三方所收集的信息。</b></p>
        <h4><b>本隐私政策将帮助您了解以下内容：</b></h4>
        <h4><b>一、我们如何收集和使用您的个人信息</b></h4>
        <h4><b>二、我们如何保存和保护您的个人信息</b></h4>
        <h4><b>三、我们如何使用 Cookies 和同类技术</b></h4>
        <h4><b>四、我们如何共享、转让、公开披露您的个人信息</b></h4>
        <h4><b>五、第三方产品或服务如何获得您的个人信息</b></h4>
        <h4><b>六、您如何管理个人信息</b></h4>
        <h4><b>七、未成年人的个人信息保护</b></h4>
        <h4><b>八、本隐私政策如何更新</b></h4>
        <h4><b>九、如何联系我们</b></h4>
        <p>本隐私政策与您所使用的悟商通系统服务以及相关服务所包括的各种业务功能息息相关，希望您在使用我们的产品与/或服务前仔细阅读并确认您已经充分理解本隐私政策所写明的内容，并让您可以按照本隐私政策的指引做出您认为适当的选择。本隐私政策中涉及的相关术语，我们尽量以简明扼要的表述，并提供进一步说明的链接，以便您更好地理解。您使用或在我们更新本隐私政策后（我们会及时提示您更新的情况）继续使用我们的产品与/或服务，即意味着您同意本隐私政策(含更新版本)内容，并且同意我们按照本隐私政策收集、使用、保存和共享您的相关信息。</p>
        <p>如对本隐私政策或相关事宜有任何问题，您可随时通过拨打我们的任何一部客服电话、邮寄函件等多种方式与我们联系。</p>
        <h4>一、我们如何收集和使用您的个人信息</h4>
        <p>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。本隐私政策中涉及的个人信息包括：基本信息（包括个人姓名、生日、性别、住址、个人电话号码、电子邮箱）；个人身份信息（包括身份证、军官证、护照、驾驶证等）；面部特征；网络身份标识信息（包括系统账号、IP 地址、邮箱地址及与前述有关的密码、口令、口令保护答案）；个人财产信息；通讯录；个人上网记录（包括网站浏览记录、软件使用记录、点击记录）；个人常用设备信息（包括硬件型号、设备 MAC 地址、操作系统类型、软件列表唯一设备识别码（如IMEI/androidID/IDFA/OPENUDID/GUID、SIM 卡 IMSI 信息等在内的描述个人常用设备基本情况的信息））；个人位置信息（包括行程信息、精准定位信息、住宿信息、经纬度等）；</p>
        <p>个人敏感信息是指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息，本隐私政策中涉及的个人敏感信息包括：您的财产信息；面部识别特征；个人身份信息（包括身份证、军官证、护照、驾驶证、户口本）；网络身份识别信息（包括账号、邮箱地址及与前述有关的密码口令的组合）；其他信息（包括通讯录、行程信息、网页浏览记录、住宿信息、精准定位信息）。</p>
        <p>我们仅会出于以下目的，收集和使用您的个人信息：</p>
        <p><b>（一）您须授权我们收集和使用您个人信息的情形</b></p>
        <p>我们的产品与/或服务包括一些核心功能，这些功能包含了实现系统服务所必须的功能及保障交易安全所必须的功能。我们可能会收集、保存和使用下列与您有关的信息才能实现上述这些功能。如果您不提供相关信息，您将无法享受我们提供的产品与/或服务。这些功能包括：</p>
        <p>1、实现系统服务必须的功能</p>
        <p>（1）用户注册</p>
        <p>当您注册时，您需要至少向我们提供您准备使用的账户名、密码、您本人的手机号码、电子邮箱地址（用于验证邮箱），我们将通过发送短信验证码或邮件的方式来验证您的身份是否有效。您可以修改补充您的实名认证相关信息，这些信息均属于您的“账户信息”。</p>
        <p>（2）当您使用实名认证功能时，您需要向我们提供您的姓名、性别、住址、个人电话号码、电子邮箱、个人身份信息（包括身份证、港澳通行证、护照等）、人脸识别信息（包括人脸图像及视频、人脸识别结果）用于平台审核你信息的是否有效；</p>
        <p>（3）当您录入补充企业基本信息时，需要提供法定代表人/经营者姓名、法定代表人/经营者身份证号码、经办人姓名、经办人手机号码、经办人身份证号码。</p>
        <p>（4）当您通过悟商通系统向银行及其他非银行金融机构办理金融产品业务时，需提供您的就业信息、资产信息、交易信息、财务信息、社保信息、纳税信息、学籍学历信息、涉诉信息、行政处罚信息、法院失信执行信息、公开负面信息、授权及负债信息、网络信息、设备信息、地理信息。</p>
        <p>（5）您通过悟商通系统进行金融产品用款、还款及贷后处理时，需提供您的贷款产品名称、授信信息（额度、额度起始日、额度期限、额度终止日、已用额度、剩余额度）、借款信息（借款人名称、证件号码、住所地址、电子邮箱、借款金额、借款期限、借款利率、借款期限、借款终止日、放款时间、借款用途、收款银行卡开户行名称、银行卡类型、银行卡号码、预留手机号、验证码）、还款信息（还款人姓名、证件号码、还款计划、还款金额、还款方式、还款日、还款银行卡开户行名称、银行卡类型、银行卡号码、预留手机号、验证码、还本本金、还款利息、罚息、欠息）。</p>
        <p>（6）我们的电话客服功能可能会根据您的要求使用您的账号信息和操作信息。</p>
        <p>为保证您的账号安全，我们的电话客服会使用您的账号信息与您核验您的身份。当您需要我们提供与您操作信息相关的客服时，我们将会查询您的操作信息。您有可能会在与我们的客服人员沟通时，提供给出上述信息外的其他信息，如当您要求我们变更身份证号、联系人或联系电话。</p>
        <p>2、保障交易安全所必须的功能</p>
        <p>为提高您使用我们的产品与/或服务时系统的安全性，更准确地预防钓鱼网站欺诈和保护账户安全，我们可能会通过了解您的浏览信息、操作信息、您常用的软件信息、设备信息等手段来判断您的账号风险，并可能会记录一些我们认为有风险的链接（“URL”）；我们也会收集您的设备信息用于对悟商通系统问题进行分析、统计流量并排查可能存在的风险、在您选择向我们发送异常信息时予以排查。</p>
        <p><b>（二）您可自主选择提供的个人信息的情形</b></p>
        <p>1、位置信息获取</p>
        <p>2、通讯录信息获取</p>
        <p>3、设备信息获取</p>
        <p>请您注意，您开启这些权限即代表您授权我们可以收集和使用这些个人信息来实现上述的功能，您关闭权限即代表您取消了这些授权，则我们将不再继续收集和使用您的这些个人信息，也无法为您提供上述与这些授权所对应的功能。您关闭权限的决定不会影响此前基于您的授权所进行的个人信息的处理。</p>
        <p><b>（三）您充分知晓，以下情形中，我们收集、使用个人信息无需征得您的授权同意：</b></p>
        <p>1、与国家安全、国防安全有关的；</p>
        <p>2、与公共安全、公共卫生、重大公共利益有关的；</p>
        <p>3、与犯罪侦查、起诉、审判和判决执行等有关的；</p>
        <p>4、出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</p>
        <p>5、所收集的个人信息是个人信息主体或监护人自行向社会公众公开的；</p>
        <p>6、从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道；</p>
        <p>7、根据您的要求签订合同所必需的；</p>
        <p>8、用于维护所提供的产品与/或服务的安全稳定运行所必需的，例如发现、处置产品与/或服务的故障；</p>
        <p>9、为合法的新闻报道所必需的；</p>
        <p>10、学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；</p>
        <p>11、法律法规规定的其他情形。</p>
        <p><b>（四）我们从第三方获得您个人信息的情形</b></p>
        <p>我们可能从第三方获取您授权共享的账户信息（头像、昵称），并在您同意本隐私政策后将您的第三方账户与您的悟商通账户绑定，使您可以通过第三方账户直接登录并使用我们的产品与/或服务。我们会将依据与第三方的约定、对个人信息来源的合法性进行确认后，在符合相关法律和法规规定的前提下，使用您的这些个人信息。</p>
        <p><b>（五）您个人信息使用的规则</b></p>
        <p>1、我们会根据本隐私政策的约定并为实现我们的产品与/或服务功能对所收集的个人信息进行使用。</p>
        <p>2、在收集您的个人信息后，我们将通过技术手段对数据进行去标识化处理，去标识化处理的信息将无法识别主体。请您了解并同意，在此情况下我们有权使用已经去标识化的信息；并在不透露您个人信息的前提下，我们有权对用户数据库进行分析并予以商业化的利用。</p>
        <p>3、请您注意，您在使用我们的产品与/或服务时所提供的所有个人信息，除非您删除或通过系统设置拒绝我们收集，否则将在您使用我们的产品与/或服务期间持续授权我们使用。在您注销账号时，我们将停止使用并删除您的个人信息。</p>
        <p>4、我们会对我们的产品与/或服务使用情况进行统计，并可能会与公众或第三方共享这些统计信息，以展示我们的产品与/或服务的整体使用趋势。但这些统计信息不包含您的任何身份识别信息。</p>
        <p>5、当我们展示您的个人信息时，我们会采用包括内容替换、匿名处理方式对您的信息进行脱敏，以保护您的信息安全。</p>
        <p>6、当我们要将您的个人信息用于本隐私政策未载明的其它用途时，或基于特定目的收集而来的信息用于其他目的时，会通过合理形式事先征求您的同意。</p>
        <h4>二、我们如何保存和保护您的个人信息</h4>
        <p><b>（一）我们保护您个人信息的技术与措施</b></p>
        <p>我们非常重视个人信息安全，并采取一切合理可行的措施，保护您的个人信息：</p>
        <p>1、我们仅允许有必要知晓这些信息的悟商通系统及关联方的员工、合作伙伴访问个人信息，并为此设置了严格的访问权限控制和监控机制。我们同时要求可能接触到您个人信息的所有人员履行相应的保密义务。如果未能履行这些义务，可能会被追究法律责任或被中止与悟商通的合作关系。</p>
        <p>2、我们会采取一切合理可行的措施，确保未收集无关的个人信息。我们只会在达成本隐私政策所述目的所需的期限内保留您的个人信息，除非需要延长保留期或受到法律的允许。</p>
        <p>3、互联网并非绝对安全的环境，而且电子邮件、即时通讯、社交软件等与其他用户的交流方式无法确定是否完全加密，我们建议您使用此类工具时请使用复杂密码，并注意保护您的个人信息安全。</p>
        <p>4、互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改、或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。</p>
        <p>5、安全事件处置</p>
        <p>在使用悟商通系统开展合作时，您不可避免的要向合作对方或潜在的合作对方披露自己的个人信息，如联络方式或者邮政地址等。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。</p>
        <p>为应对个人信息泄露、损毁和丢失等可能出现的风险，我们制定了多项制度，明确安全事件、安全漏洞的分类分级标准及相应的处理流程。我们也为安全事件建立了专门的应急响应团队，按照安全事件处置规范要求，针对不同安全事件启动安全预案，进行止损、分析、定位、制定补救措施、联合相关部门进行溯源和打击。</p>
        <p>在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。</p>
        <p>我们同时将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。</p>
        <p>6、如果您对我们的个人信息保护有任何疑问，可通过本隐私政策中约定的联系方式联系我们。如您发现自己的个人信息泄密，尤其是您的账户及密码发生泄露，请您立即通过本隐私政策中约定的联系方式联络我们，以便我们采取相应措施。</p>
        <p><b>（二）您个人信息的保存</b></p>
        <p>1、您的个人信息将存储于中华人民共和国境内。如您使用跨境交易服务，且需要向境外传输您的个人信息完成交易的，我们会单独征得您的授权同意并要求接收方按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理这些个人信息。</p>
        <p>2、请您注意，当您成功注销悟商通系统账户后，我们将对您的个人信息进行删除或匿名化处理。</p>
        <p>3、如果我们终止服务或运营，我们会至少提前三十日向您通知，并在终止服务或运营后对您的个人信息进行删除或匿名化处理。</p>
        <h4>三、我们如何使用Cookies和同类技术</h4>
        <p><b>（一）Cookies 的使用</b></p>
        <p>1、为实现您联机体验的个性化需求，使您获得更轻松的访问体验。我们会在您的计算机或移动设备上发送一个或多个名为 Cookies 的小数据文件，指定给您的 Cookies 是唯一的，它只能被将 Cookies 发布给您的域中的 Web 服务器读取。我们向您发送 Cookies 是为了简化您重复登录的步骤、帮助判断您的登录状态以及账户或数据安全。</p>
        <p><b>（二）网络 Beacon 和同类技术的使用</b></p>
        <p>除Cookies外，我们还会在网站上使用网络 Beacon 等其他同类技术。我们的网页上常会包含一些电子图像（称为"单像素"GIF 文件或"网络 Beacon"）。我们使用网络 Beacon 的方式有：</p>
        <p>1、通过在悟商通系统上使用网络 Beacon，计算用户访问数量，并通过访问 Cookies 辨认注册的用户。</p>
        <p>2、通过得到的 Cookies 信息，为您提供个性化服务。</p>
        <h4>四、我们如何共享、转让、公开披露您的个人信息</h4>
        <p><b>（一）委托处理</b></p>
        <p>我们会委托第三方服务提供商处理我们所收集的您的个人信息，以便其为我们提供基础设施技术、数据分析、广告投放、营销决策等产品或技术支持。</p>
        <p>对我们委托处理用户信息的公司、组织和个人，我们会与其签署严格的保密协议，要求他们按照我们的要求、本隐私政策以及其他任何相关的保密和安全措施来处理用户信息。</p>
        <p><b>（二）共享</b></p>
        <p>1、我们不会与悟新数科以外的任何公司、组织和个人共享您的个人信息，但以下情况除外：</p>
        <p>(1)事先获得您明确的同意或授权，或您要求我们通过电子邮件或其他方式与第三方共享您的信息；</p>
        <p>(2)根据适用的法律法规规定，或按照政府主管部门的强制性要求进行提供；</p>
        <p>(3)与我们的关联公司共享：我们可能会与我们的关联公司共享您的信息；但是我们只会共享必要的信息，且受本政策中所声明目的的约束；关联公司也将依据本政策采取同等的安全保障措施来保障您的信息安全；</p>
        <p><b>(4)与我们的业务合作伙伴共享。我们可能会将您的信息共享给金融机构或第三方。我们共享这些信息的目的是为实现服务所必需，比如我们需要将您的【姓名、身份证号、手机号、银行卡信息、身份证件材料、人脸识别信息（包括人脸图像及视频、人脸识别结果）、个人信用情况、电子邮箱、联系信息（包括地址、联系人姓名、联系方式及与您的关系）、个人状况信息、资产信息、设备情况等】共享给【金融机构】以向您提供【金融产品】服务。</b></p>
        <p>(5)只有共享您的个人信息，才能实现我们的产品与/或服务的核心功能或提供您需要的服务；</p>
        <p>(6)应您需求为您处理您与他人的纠纷或争议；</p>
        <p>(7)符合与您签署的相关协议（包括在线签署的电子协议以及相应的平台规则）或其他的法律文件约定所提供；</p>
        <p>(8)基于学术研究而使用；</p>
        <p>(9)基于符合法律法规的社会公共利益而使用。</p>
        <p>2、我们可能会将您的个人信息与我们的关联方共享。但我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。我们的关联方如要改变个人信息的处理目的，将再次征求您的授权同意。</p>
        <p>3、对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。在个人敏感数据使用上，我们要求第三方采用数据脱敏和加密技术，从而更好地保护用户数据。</p>
        <p>4、为了遵守法律、执行或适用我们的使用条件和其他协议，或者为了保护悟新数科、您或其他悟商通系统用户的权利及其财产或安全，比如为防止欺诈等违法活动和减少信用风险，而与其他公司和组织交换信息。不过,这并不包括违反本隐私政策中所作的承诺而为获利目的出售、出租、共享或以其它方式披露的个人信息。</p>
        <p><b>（三）转让</b></p>
        <p>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</p>
        <p>1、事先获得您明确的同意或授权；</p>
        <p>2、根据适用的法律法规、法律程序的要求、强制性的行政或司法要求所必须的情况进行提供；</p>
        <p>3、符合与您签署的相关协议（包括在线签署的电子协议以及相应的平台规则）或其他的法律文件约定所提供；</p>
        <p>4、在涉及合并、收购、资产转让或类似的交易时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受本隐私政策的约束，否则,我们将要求该公司、组织重新向您征求授权同意。</p>
        <p><b>（四）公开披露</b></p>
        <p>我们仅会在以下情况下，且采取符合业界标准的安全防护措施的前提下，才会公开披露您的个人信息：</p>
        <p>1、根据您的需求，在您明确同意的披露方式下披露您所指定的个人信息；</p>
        <p>2、根据法律、法规的要求、强制性的行政执法或司法要求所必须提供您个人信息的情况下，我们可能会依据所要求的个人信息类型和披露方式公开披露您的个人信息。在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。我们坚信，对于要求我们提供的信息，应该在法律允许的范围内尽可能保持透明。我们对所有的请求都进行了慎重的审查，以确保其具备合法依据，且仅限于执法部门因特定调查目的且有合法权利获取的数据。在法律法规许可的前提下，我们披露的文件均在加密密钥的保护之下。</p>
        <p>请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的信息甚至个人敏感信息。请您谨慎共享或公开，如所涉信息包含他人信息，请您在共享或公开前取得他人同意。</p>
        <p>请知悉，根据法律规定，若我们采取技术措施和其他必要措施处理信息，使得数据接收方无法重新识别特定个人且不能复原，经上述处理后的数据的共享、转让、公开披露无需另行向您通知并征得您的同意。</p>
        <h4>五、第三方产品或服务如何获得您的个人信息</h4>
        <p>为了向您提供更丰富和完整的功能，我们会使用下述第三方软件开发工具包（简称“SDK”）为您提供服务。SDK的具体信息收集和使用情况请以SDK运营方的隐私政策或相关声明为准。点击《第三方SDK类服务商目录》可查看我们接入的授权合作伙伴的SDK详情。</p>
        <!-- table -->
        <table style="border-collapse:collapse;">
          <tr>
            <th>SDK名称</th>
            <th>SDK使用目的</th>
            <th>SDK收集的信息</th>
            <th>隐私政策链接</th>
          </tr>
          <tr>
            <td>腾讯云</td>
            <td>通过OCR校验上传的图片与企业是否相符</td>
            <td>身份证及营业执照等</td>
            <td>https://www.anxinsign.com/Web/about/secretDeclare</td>
          </tr>
          <tr>
            <td>安心签</td>
            <td>电子签章、人脸识别认证及小额打款验证</td>
            <td>企业名称、手机号码、打款账户信息及证件号码等</td>
            <td>https://cloud.tencent.com/document/product/301/11470</td>
          </tr>
        </table>
        <h4>六、您如何管理您的个人信息</h4>
        <p>在您使用【悟商通平台】期间，您可以通过相应页面提示或本隐私政策载明的方式联系我们，以访问、更正、删除以及撤回同意您的信息，以及行使改变授权同意的范围与注销账号的权利，您的意见会及时得到处理。</p>
        <p><b>（一）访问及更正您的个人信息</b></p>
        <p>除法律法规规定外，您有权随时访问和更正您的个人信息，具体包括：</p>
        <p>1、您的用户信息：</p>
        <p>2、对于您在使用我们的产品与/或服务过程中产生的其他个人信息需要访问或更正，请随时联系我们。我们会根据本隐私政策所列明的方式和期限响应您的请求。</p>
        <p>3、您无法访问和更正的个人信息：除上述列明的信息外，您的部分个人信息我们还无法为您提供访问和更正的服务，这些信息主要是为了提升您的用户体验和保证交易安全所收集的您的设备信息、您使用扩展功能时产生的个人信息。上述信息我们会在您的授权范围内进行使用，您无法访问和更正，但您可联系我们进行删除或做匿名化处理。</p>
        <p><b>（二）删除您的个人信息 </b></p>
        <p>在以下情形中，您可以通过本隐私政策载明的方式向我们提出删除信息的请求：</p>
        <p>(1)我们违反法律、行政法规或与您的约定收集、使用个人信息；</p>
        <p>(2)我们违反法律、行政法规或与您的约定与第三方共享或转让您的个人信息，我们将立即停止共享、转让行为，并通知第三方及时删除；</p>
        <p>(3)我们违反法律、行政法规规定或与您的约定，公开披露您的个人信息，我们将立即停止公开披露的行为，并发布通知要求相关接收方删除相应的信息；</p>
        <p>(4)您不再使用我们的产品或服务，或您注销了账号，或我们终止服务及运营。</p>
        <p>若我们决定响应您的删除请求，我们还将同时通知从我们获得您的个人信息的实体，要求其及时删除，除非法律法规另有规定，或这些实体获得您的独立授权。若我们响应您的删除请求，我们不能保证立即从备份系统中删除相应的信息，但会在备份系统更新时删除这些信息。</p>
        <p><b>（三）改变您授权同意的范围 </b></p>
        <p>您可以通过删除信息、关闭设备功能、在悟商通系统内以授权书的形式改变您授权我们继续收集个人信息的范围或撤回您的授权。您也可以通过注销账户的方式，撤回我们继续收集您个人信息的全部授权。</p>
        <p>请您理解，每个业务功能需要一些基本的个人信息才能得以完成，当您撤回同意或授权后，我们无法继续为您提供撤回同意或授权所对应的服务，也不再处理您相应的个人信息。但您撤回同意或授权的决定，不会影响此前基于您的授权而开展的个人信息处理。</p>
        <p><b>（四）您可以与我们联系提交账号注销申请。 </b></p>
        <p>在您主动注销账号之后，我们将停止为您提供产品及或服务，根据适用法律的要求删除您的信息，或使其匿名化处理。</p>
        <p><b>（五）响应您的上述请求 </b></p>
        <p>如果您无法通过上述方式访问、更正或删除您的个人信息，或您需要访问、更正或删除您在使用我们产品与/或服务时所产生的其他个人信息，或您认为悟商通系统存在任何违反法律法规或与您关于个人信息的收集或使用的约定，您均可以通过本隐私政策中的其他方式与我们联系。为了保障安全，我们可能需要您提供书面请求，或提供您的身份证明文件，我们将在收到您反馈并验证您的身份后的 15 个日历天内答复您的请求。对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。</p>
        <p>在以下情形中，按照法律法规要求，我们将无法响应您的请求：</p>
        <p>1、与国家安全、国防安全有关的；</p>
        <p>2、与公共安全、公共卫生、重大公共利益有关的；</p>
        <p>3、与犯罪侦查、起诉和审判等有关的；</p>
        <p>4、有充分证据表明您存在主观恶意或滥用权利的；</p>
        <p>5、响应您的请求将导致您或其他个人、组织的合法权益受到损害的。</p>
        <h4>七、未成年人的个人信息保护</h4>
        <p>悟新数科基于企业商事行为提供相关服务，原则上不接受无工作单位的未成年人进行注册使用。</p>
        <p>如果有未成年人基于监护人同意注册并使用悟商通系统,我们将按照一般用户的标准进行信息收集与保护，并对相应账号权限进行限定，确保未成年账户各项操作经过相关授权。</p>
        <p>如果有事实证明未成年人并未取得监护人同意的情况下注册使用了我们的产品与/或服务，我们会与相关监护人协商，并设法尽快删除相关个人信息。</p>
        <h4>八、本隐私政策如何更新</h4>
        <p>我们的隐私政策可能会适时发生变更。我们会在本页面上发布对本隐私政策所做的任何变更。对于重大变更，我们还会提供更为显著的通知（我们可能会通过在浏览页面做特别提示等方式，说明隐私政策的具体变更内容）。未经您明确同意，我们不会削减您按照本隐私政策所应享有的权利。</p>
        <p>本隐私政策所指的重大变更包括但不限于：我们的服务模式发生重大变化；信息共享、转让或公开披露的主要对象发生变化；您参与信息处理方面的权利及其行使方式发生重大变化；我们的联系方式及投诉渠道发生变化；信息安全影响评估报告表明存在高风险时。</p>
        <p>我们还会将本隐私政策的旧版本存档，供您查阅。</p>
        <h4>九、如何联系我们</h4>
        <p>如果您对本政策或信息保护有任何问题，您可以将您的书面疑问、意见或建议通过以下地址寄至客服部门或通过向我们的邮箱发送电子邮件与我们联系：</p>
        <p>名称：【悟新（深圳）数字科技有限公司】</p>
        <p>地址：【深圳市南山区粤海街道科技园社区科苑路15号科兴科学园A栋A1-802】</p>
        <p>联系电话：【0755-86169969】</p>
        <p>电子邮箱：【wuxinshuke@newisdom.com.cn】</p>
        <p>我们设立了个人信息保护专职部门（或个人信息保护专员），您可以通过以下方式与其联系：</p>
        <p>联系电话：【0755-86169969】</p>
        <p>一般情况下，我们将在十五个工作日内回复。<b>如果您对我们的回复不满意，特别是我们的信息处理行为损害了您的合法权益，您可以通过向我们住所地有管辖权的法院提起诉讼来寻求解决方案。</b></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancelAgreeRegister()">取 消</el-button> -->
        <el-button @click="agreeAndRegister()">关 闭</el-button>
        <!-- <el-button type="primary" :disabled="countStr !== 0" @click="agreeAndRegister()">
          同意并注册
          <span v-if="countStr">({{ countStr }}s)</span>
        </el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import SocialSign from './components/SocialSignin'
const CryptoJS = require('crypto-js')
import SliderCheck from './components/SliderCheck'
import { sendMsg, pageSysConfig } from '@/api/user'
import { tellPhone } from '@/utils/validate'
// import moment from 'moment'
import { setDefaultConfig, getDefaultConfig, removeDefaultConfig } from '@/utils/auth'
import colorPicker from '@/components/ThemePicker/colorPicker.vue'
export default {
  name: 'Login',
  // components: { SocialSign },
  components: {
    SliderCheck
  },
  mixins: [colorPicker],
  data() {
    return {
      loginForm: {
        username: '',
        grant_type: 'password',
        scope: 'server',
        password: '',
        status: false
      },
      logoUrl: require('@/assets/wxskLogo.png'),
      loginRules: {
        username: [
          { required: true, trigger: 'change', message: '请输入手机号' },
          {
            validator: tellPhone,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, trigger: 'change', message: '请输入验证码' }
        ]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      loginXyChecked: false, // 登录协议确认
      token: '',
      countTime: 60,
      countTimeFnc: null,
      centerDialogVisible: false, // 选择公司dialog
      radio: null,
      // countStr: 5,
      radioListData: [],
      // title: '',
      instructionsVisible: false,
      instructionsVisible2: false,
      // curTime: '',
      resetSlider: false,
      xyChecked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    'loginForm.username': function(newVal, oldVal) {
      this.resetSlider = newVal.length === 11 && newVal !== oldVal
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    // 根据keyName获取数据
    this.pageSysConfig()
  },
  destroyed() {},
  methods: {
    // 查看协议
    // signInstructe(type) {
    //   this.instructionsVisible = true
    //   // this.countStr = 5
    //   // this.countFunc()
    // },
    // countFunc() {
    //   this.setTimeoutObject = setTimeout(() => {
    //     this.countStr -= 1
    //     if (this.countStr === 0) {
    //       clearTimeout(this.setTimeoutObject)
    //     } else {
    //       this.countFunc()
    //     }
    //   }, 1000)
    // },
    // 滑块验证成功回调
    handleSuccessFun() {
      this.loginForm.status = true
    },
    // 滑块验证失败回调
    handleErrorFun() {
      this.loginForm.status = false
    },
    // 根据keyName获取数据
    async pageSysConfig() {
      const { tagSystem } = this.$route.query
      const keyName = {
        keyName: window.localStorage.getItem('keyName') || tagSystem
      }
      removeDefaultConfig()
      const res = await pageSysConfig(keyName)
      if (res.code === '0') {
        // 设置颜色
        // this.setTheme()
        res.data && setDefaultConfig(res.data)
        this.$store.dispatch('settings/changeSetting', {
          key: 'theme',
          value: res.data && res.data.toneVal
        })
        // 设置logo
        this.logoUrl = process.env.NODE_ENV === 'development'
          ? process.env.VUE_APP_BASE_REQUESTURL + decodeURI(res.data.pcLogoPath)
          : decodeURI(res.data.pcLogoPath) || ''
        // 全局设置系统配色
        const root = document.querySelector(':root')
        root.style.setProperty('--theme', getDefaultConfig().toneVal)
      } else {
        this.$message.error(res.msg)
      }
    },
    handleLogin() {
      const vm = this
      if (this.loading) {
        return
      }
      if (!this.loginForm.status) {
        this.$message.warning('请先进行拖动验证')
        return
      }
      // 未勾选同意平台协议不允许登录
      if (!this.loginXyChecked) return
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // AES 对称性加密密码
          // const oldPasswordNoAes = vm.loginForm.password // 没有加密过的原密码，对应强制修改密码的时候用
          const encryptPassword = CryptoJS.AES.encrypt(
            vm.loginForm.password,
            CryptoJS.enc.Latin1.parse('newisdomcss2021.'),
            {
              iv: CryptoJS.enc.Latin1.parse('newisdomcss2021.'),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.ZeroPadding
            }
          ).toString()
          // vm.loginForm.password = encryptPassword
          const requestObj = {
            ...vm.loginForm,
            password: encryptPassword
          }
          this.$store
            .dispatch('user/login', requestObj)
            .then((res) => {
              this.loading = false
              // vm.loginForm.password = oldPasswordNoAes
              vm.loginForm.token = res.access_token
              // vm.curTime = moment(res.login_info.loginDate).format('YYYY年MM月DD日')
              vm.radioListData = res.login_info.customerList
              if (vm.radioListData.length > 1) {
                // 如果没有选择公司，必须要选
                if (res.login_info.isCheckedCompany !== 1) {
                  this.centerDialogVisible = true
                } else {
                  this.$router.push('/')
                }
                // else if (res.login_info.isReadAgreement !== 1) {
                //   // 第一次登录需要阅读用户须知
                //   this.instructionsVisible = true
                //   // this.countStr = 5
                //   this.countFunc()
                // }
              } else if (vm.radioListData.length === 1 && vm.radioListData[0].custTypeId !== 5) {
                this.loginForm.customerId = vm.radioListData[0].customerId
                this.$router.push('/')
                // 只有一家公司，并且正好不是经销商可以直接进入系统
                // if (res.login_info.isReadAgreement === 1) {
                //   this.$router.push('/')
                // } else {
                // this.instructionsVisible = true
                // this.countStr = 5
                // this.countFunc()
                // }
              } else {
                // 只有一家公司，并且是经销商，弹出让用户选择公司
                this.centerDialogVisible = true
              }
            })
            .catch((error) => {
              if (error.response && error.response.data.code === '-6') {
                vm.loginForm.code = ''
                // vm.loginForm.password = oldPasswordNoAes
              } else {
                vm.loginForm.password = ''
              }
              this.loading = false
              error.response && this.$message.error(error.response.data.msg)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    requestCode() {
      if (!this.loginForm.username) {
        this.$message.warning('请填写手机号')
        return false
      } else if (this.countTime !== 60) {
        return
      }
      if (!this.loginForm.status) {
        this.$message.warning('请先进行拖动验证')
        return
      }
      sendMsg({
        mobile: this.loginForm.username,
        type: 1,
        clientType: 1
      }).then((res) => {
        if (res.code === '0') {
          this.$message.success('验证码已发送')
          this.countTimeFnc = setInterval(() => {
            this.countTime--
            if (this.countTime < 1) {
              clearInterval(this.countTimeFnc)
              this.countTime = 60
            }
          }, 1000)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    checkedCompany() {
      // 如果选择了经销商，引导去移动端使用
      const newArr = this.radioListData.filter(res => {
        return res.customerId === this.radio
      })
      if (newArr[0] && newArr[0].custTypeId === 5) {
        this.$message.warning('经销商请在移动端登录')
        return
      } else if (this.radio) {
        this.loginForm.customerId = this.radio
        // 选择登录公司后要传另外的密码
        this.loginForm.password = '000000'
        this.centerDialogVisible = false
        this.handleLogin()
      } else {
        this.$message.warning('请选择一家公司')
        return
      }
    },
    cancelChooiseCompany() {
      delete this.loginForm.token
      this.centerDialogVisible = false
    },
    // cancelAgreeRegister() {
    //   delete this.loginForm.token
    //   // this.xyChecked = false
    //   this.instructionsVisible = false
    // },
    agreeAndRegister() {
      // if (!this.xyChecked) {
      //   this.$message.warning('请勾选系统服务协议')
      //   return
      // }
      this.instructionsVisible = false
      this.instructionsVisible2 = false
      // this.loginForm.isReadAgreement = 1 // 代表已读
      // this.loginForm.password = '000000'
      // this.handleLogin()
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #ffffff;
$light_gray: #303133;
$cursor: #303133;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    border: 1px solid #ccc;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 45px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  align-items: center;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 32px 60px 40px;
    margin: 0 auto;
    overflow: hidden;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #cccccc;
    text-align: center;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: var(--theme);
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;

    .title {
      font-size: 40px;
      color: var(--theme);
      margin: 0px auto 10px auto;
      font-weight: 500;
      display: flex;
      justify-content: center;
      line-height: 57px;
    }

    .title2 {
      font-size: 36px;
      margin: 0px auto 40px auto;
    }
  }
  .logoStyle {
      width: 240px;
      height: 100px;
     ::v-deep {
       .el-image__inner {
          object-fit: contain
       }
     }
    }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: var(--theme);
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .el-form-item__content {
    position: relative;
    .img {
      position: absolute;
      right: 15px;
      cursor: pointer;
      color: var(--theme);
      line-height: 47px;
      border-left: 1px solid #cecece;
      padding-left: 15px;
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.form-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }

  .title-operation {
    .el-link--inner {
      color: #fff;
    }
  }

  .el-link.el-link--default:after {
    border-color: #fff;
  }
}
.slider-check-box {
  margin-bottom: 22px;
}
::v-deep .el-form-item--medium .el-form-item__label {
  line-height: 48px;
}
// ::v-deep .el-form-item__error {
//   left: 16px;
//   padding-top: 6px;
// }
// 选择公司css
.el-radio-group {
  width: 100%;
}
.el-radio {
  display: block;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.instructions p {
  text-indent: 2em;
  text-align: justify;
  text-justify: distribute;
}
.instructions h4 {
  font-weight: bold;
}
.loginXyChecked {
  text-align: left;
  .underline {
    color: var(--theme);
    text-decoration: underline;
  }
  span {
    color: #AAAAAA;
  }
  i {
    color: #323232;
    font-style: normal;
  }
}
.passwordStyle {
  margin-bottom: 5px;
}
th, td {
  margin-right: -5px;
  padding: 5px;
  border: 1px solid black;
}
</style>
